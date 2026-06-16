import type { Course } from "../types";

// Course 1 is fully built (async-as-mentor lessons + quizzes). Courses 2–3 are lighter.
export const COURSES: Course[] = [
  {
    id: "sat-math-essentials",
    title: "SAT Math Essentials",
    description: "Закрой ключевые пробелы по SAT Math: функции, геометрия, проценты.",
    level: "intermediate",
    topic_tags: ["sat_math", "functions", "geometry"],
    lessons: [
      {
        id: "sme-1",
        ord: 1,
        title: "Функции: основа",
        content_md:
          "Функция — это правило, которое каждому входу x ставит в соответствие один выход f(x).\n\n**Пример:** f(x) = 2x + 1. Тогда f(3) = 2·3 + 1 = 7.",
        video_url: "https://example.com/placeholder",
        task_md: "Найди f(5), если f(x) = 2x + 1.",
        quiz: [
          { q: "f(x) = 2x + 1. Чему равно f(5)?", options: ["10", "11", "9", "12"], correctIndex: 1 },
          { q: "f(x) = x². Чему равно f(4)?", options: ["8", "12", "16", "20"], correctIndex: 2 },
          { q: "Сколько выходов у функции для одного входа?", options: ["0", "1", "2", "много"], correctIndex: 1 },
        ],
      },
      {
        id: "sme-2",
        ord: 2,
        title: "Линейные уравнения",
        content_md: "Линейное уравнение имеет вид ax + b = 0. Решение: x = -b/a.",
        task_md: "Реши: 3x - 9 = 0.",
        quiz: [
          { q: "Реши 3x - 9 = 0", options: ["x = 1", "x = 2", "x = 3", "x = 9"], correctIndex: 2 },
          { q: "Реши 2x + 4 = 0", options: ["x = -2", "x = 2", "x = -4", "x = 0"], correctIndex: 0 },
        ],
      },
      {
        id: "sme-3",
        ord: 3,
        title: "Проценты",
        content_md: "p% от числа N = N · p / 100.",
        task_md: "Найди 20% от 150.",
        quiz: [{ q: "20% от 150 = ?", options: ["20", "30", "15", "45"], correctIndex: 1 }],
      },
      {
        id: "sme-4",
        ord: 4,
        title: "Геометрия: площади",
        content_md: "Площадь прямоугольника = a · b. Площадь треугольника = (a · h) / 2.",
        task_md: "Площадь треугольника с основанием 6 и высотой 4?",
        quiz: [{ q: "Треугольник: основание 6, высота 4. Площадь?", options: ["10", "12", "24", "14"], correctIndex: 1 }],
      },
      {
        id: "sme-5",
        ord: 5,
        title: "Итоговый мини-тест",
        content_md: "Проверь себя по всем темам курса.",
        task_md: "Пройди финальный тест.",
        quiz: [
          { q: "f(x)=3x. f(2)=?", options: ["5", "6", "9", "3"], correctIndex: 1 },
          { q: "25% от 80 = ?", options: ["15", "20", "25", "40"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: "ielts-30-days",
    title: "IELTS in 30 Days",
    description: "Быстрый старт по Reading и Writing для IELTS.",
    level: "intermediate",
    topic_tags: ["ielts_reading", "ielts_writing"],
    lessons: [
      {
        id: "iel-1",
        ord: 1,
        title: "Формат теста IELTS",
        content_md: "IELTS состоит из 4 секций: Listening, Reading, Writing, Speaking.",
        quiz: [{ q: "Сколько секций в IELTS?", options: ["2", "3", "4", "5"], correctIndex: 2 }],
      },
      { id: "iel-2", ord: 2, title: "Reading: стратегии (скоро)", content_md: "Скоро.", quiz: [] },
      { id: "iel-3", ord: 3, title: "Writing Task 1 (скоро)", content_md: "Скоро.", quiz: [] },
    ],
  },
  {
    id: "ent-math-base",
    title: "ЕНТ Математика: База",
    description: "Базовые темы ЕНТ по математике.",
    level: "beginner",
    topic_tags: ["ent_math", "percentages", "equations"],
    lessons: [
      {
        id: "ent-1",
        ord: 1,
        title: "Проценты на ЕНТ",
        content_md: "Базовые задачи на проценты в формате ЕНТ.",
        quiz: [{ q: "10% от 200 = ?", options: ["10", "20", "30", "2"], correctIndex: 1 }],
      },
      { id: "ent-2", ord: 2, title: "Уравнения (скоро)", content_md: "Скоро.", quiz: [] },
    ],
  },
];
