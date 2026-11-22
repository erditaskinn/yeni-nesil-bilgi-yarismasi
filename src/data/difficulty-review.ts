import type { Difficulty } from "../lib/config";
import type { Question } from "../lib/types";

export const DIFFICULTY_REVIEW = {
  reviewedAt: "2026-09-28",
  criteria: {
    easy: "Tanıdık günlük veya temel okul bilgisi; teknik terim, özel tarih ve uzmanlık ayrıntısı yok.",
    medium: "Yaygın genel kültür; bilinen bir eser, yer, bilimsel kavram veya temel kural.",
    hard: "Alan bilgisi, daha az bilinen ilişkiler, teknik terimler veya özel ayrıntılar.",
    expert: "Kesin tarihler, ölçüler, katalog bilgileri ve ileri düzey bilim veya kural ayrıntıları.",
  },
} as const;

// IDs retain their original meaning; prefixes are not the current difficulty.
// Unlisted records retain their level after editorial review. Factual review dates
// remain separate: changing difficulty does not imply re-verifying a source.
const changes: Record<Difficulty, string> = {
  easy: "m10 m21 m69 m77 m118 m119 m120 m125 h45 h86 h122 h123 h124 x119 x123",
  medium: "e04 e08 e19 e22 e23 e24 e27 e28 e29 e30 e32 e33 e36 e37 e38 e39 e40 e41 e42 e43 e44 e48 e50 e51 e52 e53 e54 e55 e56 e57 e58 e59 e61 e67 e68 e69 e71 e74 e75 e77 e78 e79 e83 e84 e85 e86 e88 e89 e93 e94 e95 e96 e97 e98 e102 e103 e106 e109 e110 e112 e114 e115 e116 e120 e124 m121 h01 h02 h04 h11 h12 h13 h14 h15 h16 h17 h18 h21 h23 h28 h29 h30 h32 h33 h38 h40 h44 h47 h49 h50 h56 h57 h61 h67 h71 h75 h76 h77 h82 h83 h87 h88 h89 h90 h92 h107 h108 h109 h110 h111 h112 h114 h115 h118 x03 x05 x15 x28 x31 x34 x36 x37 x38 x40 x45 x46 x47 x64 x70 x72 x74 x90 x91 x92 x93 x98 x101 x111 x113 x114 x115 x122",
  hard: "e35 e60 e70 e76 e104 e105 e107 e111 e113 e117 e118 m04 m14 m17 m19 m22 m24 m26 m40 m41 m43 m46 m49 m51 m53 m55 m58 m59 m61 m63 m65 m66 m70 m71 m72 m73 m74 m76 m79 m81 m84 m86 m92 m94 m97 m98 m103 m105 m108 m109 m111 m112 m113 m123 m124 x01 x02 x04 x06 x07 x12 x14 x17 x20 x21 x26 x27 x30 x32 x42 x48 x50 x54 x55 x56 x61 x62 x63 x65 x66 x67 x68 x69 x73 x75 x76 x77 x78 x79 x80 x81 x82 x83 x84 x85 x86 x87 x88 x89 x96 x108 x112 x116 x120 x121 x124",
  expert: "m52 m54 m62 h03 h06 h24 h34 h39 h41 h51 h52 h53 h54 h55 h58 h60 h62 h63 h65 h68 h70 h78 h79 h80 h81 h84 h85 h93 h98 h99 h100 h101 h102 h103 h104 h105 h106 h113 h125",
};

export const DIFFICULTY_CHANGES: ReadonlyMap<string, Difficulty> = (() => {
  const result = new Map<string, Difficulty>();
  for (const [level, ids] of Object.entries(changes)) {
    for (const id of ids.split(" ")) {
      if (result.has(id)) throw new Error(`Duplicate difficulty review: ${id}`);
      result.set(id, level as Difficulty);
    }
  }
  return result;
})();

export function reviewDifficulties(pool: readonly Question[]): Question[] {
  const ids = new Set(pool.map(q => q.id));
  for (const id of DIFFICULTY_CHANGES.keys()) {
    if (!ids.has(id)) throw new Error(`Unknown difficulty review ID: ${id}`);
  }
  return pool.map(q => ({ ...q, difficulty: DIFFICULTY_CHANGES.get(q.id) ?? q.difficulty }));
}
