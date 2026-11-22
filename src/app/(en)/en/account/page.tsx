import type { Metadata } from "next";
import { QuizApp } from "../../../../components/quiz-app";
export const metadata: Metadata = { title: "My Account | Next Gen Trivia Quiz", robots: { index: false, follow: true }, alternates: { canonical: "/en/account" } };
export default function Page() { return <QuizApp locale="en" initialScreen="account" />; }
