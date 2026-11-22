import type { Metadata } from "next";
import { QuizApp } from "../../../components/quiz-app";
export const metadata: Metadata = { title: "Hesabım | Yeni Nesil Bilgi Yarışması", robots: { index: false, follow: true }, alternates: { canonical: "/hesap" } };
export default function Page() { return <QuizApp initialScreen="account" />; }
