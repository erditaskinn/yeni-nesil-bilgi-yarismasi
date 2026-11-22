"use client";

import { useState, type FormEvent } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { useI18n } from "./locale-provider";
import type { Answer, Question } from "../lib/types";
import type { QuestionResponse } from "../lib/question-engine";

export function correctAnswerText(question: Question): string {
  if (question.format?.type === "map_selection") return question.format.regions.find(region => region.id === question.correctAnswer)?.label ?? question.correctAnswer;
  if (question.format?.type === "chronological_order") {
    const format = question.format;
    return format.order.map(id => {
    const event = format.events.find(item => item.id === id);
    return event ? `${event.text} (${event.date})` : id;
    }).join("; ");
  }
  if (question.format?.type === "matching") {
    const format = question.format;
    return format.left.map(item => {
    const right = format.right.find(value => value.id === format.pairs[item.id]);
    return `${item.text}: ${right?.text ?? "?"}`;
    }).join("; ");
  }
  return question.choices.find(choice => choice.id === question.correctAnswer)?.text ?? question.correctAnswer;
}

export function selectedAnswerText(question: Question, answer: Pick<Answer, "selectedId" | "response">): string {
  if (answer.response?.type === "map" && question.format?.type === "map_selection") {
    const id = answer.response.id;
    return question.format.regions.find(region => region.id === id)?.label ?? id;
  }
  if (answer.response?.type === "text") return answer.response.value;
  if (answer.response?.type === "order" && question.format?.type === "chronological_order") {
    const format = question.format;
    return answer.response.ids.map(id => format.events.find(item => item.id === id)?.text ?? id).join("; ");
  }
  if (answer.response?.type === "matches" && question.format?.type === "matching") {
    const format = question.format;
    const pairs = answer.response.pairs;
    return format.left.map(item => {
      const right = format.right.find(value => value.id === pairs[item.id]);
      return `${item.text}: ${right?.text ?? "?"}`;
    }).join("; ");
  }
  return question.choices.find(choice => choice.id === answer.selectedId)?.text ?? answer.selectedId ?? "";
}

export function solutionDetail(question: Question): string | null {
  if (question.format?.type === "fill_in_blank") return question.format.completedText;
  if (question.format?.type === "odd_one_out") return question.format.difference;
  return null;
}

export function QuestionAnswer({
  question, locked, revealCorrectAnswer = true, selectedId, initialText = "", onAnswer, onMediaLoad, onMediaError,
}: {
  question: Question;
  locked: boolean;
  revealCorrectAnswer?: boolean;
  selectedId: string | null;
  initialText?: string;
  onAnswer: (response: QuestionResponse, selectedId: string) => void;
  onMediaLoad?: () => void;
  onMediaError?: () => void;
}) {
  const { t } = useI18n();
  const [text, setText] = useState(initialText);
  const [order, setOrder] = useState(() => question.format?.type === "chronological_order" ? question.format.events.map(event => event.id) : []);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  if (question.format?.type === "map_selection") {
    const format = question.format;
    const choose = (id: string) => onAnswer({ type: "map", id }, id);
    return <div className="map-answer">
      <div className="map-frame">
        <svg viewBox={format.viewBox} role="img" aria-label={format.media?.alt ?? (t("choices"))}>
          {format.media && <image href={format.media.src} width="1000" height="500" onLoad={onMediaLoad} onError={onMediaError} />}
          {format.regions.map((region, index) => region.x === undefined || region.y === undefined ? null : <g key={region.id} className="map-marker" onClick={() => !locked && choose(region.id)}>
            <circle cx={region.x} cy={region.y} r="68" />
            <text x={region.x} y={region.y} textAnchor="middle" dominantBaseline="central">{String.fromCharCode(65 + index)}</text>
          </g>)}
        </svg>
      </div>
      <div className="map-options" role="group" aria-label={t("choices")}>
        {format.regions.map((region, index) => <button key={region.id} type="button" className={`choice ${locked && region.id === question.correctAnswer ? "correct" : ""} ${locked && region.id === selectedId && selectedId !== question.correctAnswer ? "incorrect" : ""}`}
          disabled={locked} onClick={() => choose(region.id)}>
          <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span className="choice-text">{region.label}</span>
        </button>)}
      </div>
      {locked && format.media && <a className="image-credit" href={format.media.licenseUrl} target="_blank" rel="noreferrer">{format.media.credit} · {t("imageSource")}</a>}
    </div>;
  }
  if (question.format?.type === "chronological_order") {
    const format = question.format;
    const move = (from: number, to: number) => setOrder(current => {
      const next = [...current];
      [next[from], next[to]] = [next[to]!, next[from]!];
      return next;
    });
    return <div className="complex-answer">
      <ol className="order-list" aria-label={t("orderItems")}>
        {order.map((id, index) => {
          const event = format.events.find(item => item.id === id)!;
          return <li key={id} className="order-item">
            <span className="order-position">{index + 1}</span><span>{event.text}</span>
            <div className="order-actions">
              <button type="button" aria-label={`${t("moveUp")}: ${event.text}`} title={t("moveUp")} disabled={locked || index === 0} onClick={() => move(index, index - 1)}><ChevronUp size={20} /></button>
              <button type="button" aria-label={`${t("moveDown")}: ${event.text}`} title={t("moveDown")} disabled={locked || index === order.length - 1} onClick={() => move(index, index + 1)}><ChevronDown size={20} /></button>
            </div>
          </li>;
        })}
      </ol>
      <button className="button primary" type="button" disabled={locked} onClick={() => onAnswer({ type: "order", ids: order }, order.join(","))}>{t("submitAnswer")}</button>
    </div>;
  }
  if (question.format?.type === "matching") {
    const format = question.format;
    return <div className="complex-answer">
      <div className="matching-grid">
        <div role="group" aria-label={t("matchLeft")}>
          <strong>{t("matchLeft")}</strong>
          {format.left.map(item => {
            const match = format.right.find(right => right.id === pairs[item.id]);
            return <button key={item.id} className="matching-item" type="button" aria-pressed={activeLeft === item.id} disabled={locked} onClick={() => setActiveLeft(item.id)}>
              <span>{item.text}</span><small>{match?.text ?? t("unmatched")}</small>
            </button>;
          })}
        </div>
        <div role="group" aria-label={t("matchRight")}>
          <strong>{t("matchRight")}</strong>
          {format.right.map(item => <button key={item.id} className="matching-item" type="button" disabled={locked || !activeLeft} onClick={() => {
            const left = activeLeft;
            if (!left) return;
            setPairs(current => ({ ...Object.fromEntries(Object.entries(current).filter(([key, value]) => key !== left && value !== item.id)), [left]: item.id }));
            setActiveLeft(null);
          }}>{item.text}</button>)}
        </div>
      </div>
      <button className="button primary" type="button" disabled={locked || Object.keys(pairs).length !== format.left.length} onClick={() => onAnswer({ type: "matches", pairs }, JSON.stringify(pairs))}>{t("submitAnswer")}</button>
    </div>;
  }
  if (question.format?.type === "fill_in_blank" && question.format.mode === "text") {
    const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!locked && text.trim()) onAnswer({ type: "text", value: text }, text);
    };
    return <form className="written-answer" onSubmit={submit}>
      <label htmlFor={`written-answer-${question.id}`}>{t("fillWrittenAnswer")}</label>
      <div className="written-answer-row">
        <input id={`written-answer-${question.id}`} value={text} onChange={event => setText(event.target.value)}
          maxLength={200} autoComplete="off" spellCheck={false} disabled={locked} />
        <button className="button primary" type="submit" disabled={locked || !text.trim()}>{t("submitAnswer")}</button>
      </div>
    </form>;
  }
  return <div className={`choices ${question.format?.type === "true_false" ? "binary-choices" : ""}`} role="group" aria-label={t("choices")}>
    {question.choices.map((choice, index) => {
      const correct = locked && revealCorrectAnswer && choice.id === question.correctAnswer;
      const wrong = locked && revealCorrectAnswer && choice.id === selectedId && !correct;
      return <button key={choice.id} className={`choice ${correct ? "correct" : ""} ${wrong ? "incorrect" : ""}`}
        disabled={locked} onClick={() => onAnswer({ type: "choice", id: choice.id }, choice.id)}>
        <span className="choice-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
        <span className="choice-text">{choice.text}</span>
        {correct && <><Check className="choice-state" size={21} /><span className="sr-only">{t("correctAnswer")}</span></>}
        {wrong && <><X className="choice-state" size={21} /><span className="sr-only">{t("wrongAnswer")}</span></>}
      </button>;
    })}
  </div>;
}
