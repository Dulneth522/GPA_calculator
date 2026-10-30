import { GradingScale, Semester, Subject } from '../types/academic';
import { getGradePoint } from './gpaCalculator';

export function exportAcademicHistoryToCsv(
  semesters: Semester[],
  subjects: Subject[],
  scale: GradingScale
) {
  const headers = [
    'Academic Year',
    'Semester',
    'Subject Code',
    'Subject Title',
    'Credits',
    'Grade',
    'Grade Points',
    'Credit Points',
    'Counted in GPA',
  ];

  const rows: string[][] = [headers];

  for (const sem of semesters) {
    const semSubjects = subjects.filter((s) => s.semesterId === sem.id);
    for (const sub of semSubjects) {
      const gp = getGradePoint(sub.grade, scale) ?? 0;
      const cp = sub.includeInGpa ? (gp * Number(sub.credits)).toFixed(2) : '0.00';

      rows.push([
        `"${sem.academicYear}"`,
        `"${sem.name}"`,
        `"${sub.code}"`,
        `"${sub.title.replace(/"/g, '""')}"`,
        `${sub.credits}`,
        `"${sub.grade}"`,
        `${gp.toFixed(2)}`,
        `${cp}`,
        sub.includeInGpa ? 'Yes' : 'No',
      ]);
    }
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `unipath_academic_history_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
