import { Curriculum } from "@/types/curriculum";
import { sampleUnit1 } from "./seed/grade3_hello_and_friends";

export const standardSchoolCurriculum: Curriculum = {
  id: "curriculum_vn_standard",
  title: "Chương Trình Tiếng Anh Tiểu Học & Trung Học",
  standard: "Vietnam National School Standard Alignment",
  grades: [
    {
      grade: 3,
      displayName: "Lớp 3 — Khởi Động Tự Tin",
      description: "Làm quen với giao tiếp cơ bản, từ vựng gia đình, bạn bè và trường học.",
      targetCefrLevel: "Pre-A1 / A1",
      units: [sampleUnit1],
    },
  ],
};
