import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { assessmentAttemptsCol, questionsCol, apiKeysCol, type AIProvider } from "@/lib/models";
import { getAssessmentModule } from "@/lib/assessment-modules";
import { AttemptRunner } from "@/components/assessments/attempt-runner";

export default async function AttemptPage({
  params,
}: {
  params: Promise<{ moduleId: string; attemptId: string }>;
}) {
  const { moduleId, attemptId } = await params;
  const moduleInfo = getAssessmentModule(moduleId);
  if (!moduleInfo) notFound();

  const session = await getSession();
  if (!session) return null;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(attemptId);
  } catch {
    notFound();
  }

  const col = await assessmentAttemptsCol();
  const attempt = await col.findOne({ _id: objectId });
  if (!attempt || attempt.moduleId !== moduleId) notFound();
  if (attempt.userId !== session.userId) notFound();
  if (attempt.status === "graded") {
    redirect(`/student/assessments/${moduleId}/attempt/${attemptId}/result`);
  }

  const qCol = await questionsCol();
  const questions = await qCol.find({ moduleId }).sort({ order: 1 }).toArray();

  const keys = await apiKeysCol();
  const savedProviders = (await keys.find({ userId: session.userId }).toArray()).map((k) => k.provider as AIProvider);

  return (
    <AttemptRunner
      moduleId={moduleId}
      moduleTitle={moduleInfo.title}
      attempt={{
        _id: attempt._id!.toString(),
        startedAt: attempt.startedAt.toISOString(),
        timeLimitSec: attempt.timeLimitSec,
        answers: attempt.answers.map((a) => ({
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          answerText: a.answerText,
        })),
      }}
      questions={questions.map((q) => ({
        _id: q._id!.toString(),
        questionType: q.questionType,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks,
        order: q.order,
      }))}
      savedProviders={savedProviders}
    />
  );
}
