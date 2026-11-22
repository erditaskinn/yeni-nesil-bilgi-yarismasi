import { DIFFICULTIES, type Difficulty } from "../lib/config";
import type { Question } from "../lib/types";

/** Turkish-only editorial difficulty review for additions after the 580-question review. */
export const TURKISH_DIFFICULTY_REVIEW_DATE = "2026-11-09";

const changes: Record<Difficulty, string> = {
  easy: "tre003 tre017 trh012 tri041 tri042 tri033 trj014 trj015 trj024",
  medium: "t001 t002 t005 t006 t017 f002 f004 f005 f006 f008 f009 trb005 trd007 tre007 trh005 trh011 trh018 trh031 trh038 trj001 trj011 trj027 trk001 trk002 trk041 trk045 trk050 trl001 trl004 trl017 trl020 trl026 trl033 trl037 trm015 trm044 trn008 trn036 tri001 tri021 tri031 tri037 trg031 trg034 trg037 trd006 tre016 trg018 trg019 trg040 trh029 trh040 tri005 trj023 trj022 trj025 trj030 trj049 trk003 trk004 trk005 trk006 trk007 trk008 trk009 trk010 trk023 trk024 trk028 trk029 trk030 trk038 trk039 trk043 trl002 trl003 trl005 trl007 trl008 trl010 trl012 trl013 trl018 trl022 trl034 trl035 trl038 trl039 trm039 trm047 trm048 trm050 trk049 trn013 trn018 trn028 trn038 trn047 trn049",
  hard: "t003 t008 t009 t010 t011 t012 t013 t014 t015 t016 t019 f001 f007 f011 f017 f018 f020 trb002 trb006 trb007 trb010 trd001 trg001 trg005 trg011 trf011 trf015 trf018 trh041 trh042 trh046 tri011 trj008 trj031 trj036 trj041 trj043 trj045 trj048 trk011 trk021 trk027 trk031 trk036 trl009 trl011 trl014 trl023 trl029 trl042 trm001 trm012 trm030 trn001 trn022 trn029 trn044 trc003 trc006 trd015 trd016 tre012 trf012 trf014 trf016 trf020 trg021 trg025 trg029 trg041 trg045 trg048 trg050 trh004 trh015 trh017 trh026 trh032 trh035 trh049 tri012 tri013 tri016 tri017 tri032 tri036 tri038 trj002 trj005 trj007 tri040 trj013 trj016 trj029 trj032 trj033 trj034 trj035 trj037 trj038 trj039 trj040 trj042 trj044 trj046 trj047 trj050 trk012 trk013 trk014 trk015 trk016 trk017 trk018 trk019 trk020 trk025 trk026 trk032 trk033 trk034 trk035 trk037 trk040 trk044 trk046 trl015 trl016 trl019 trl021 trl024 trl025 trl027 trl028 trl030 trl031 trl032 trl036 trl040 trl041 trm002 trm003 trm006 trm022 trm025 trm029 trm031 trm032 trm035 trm036 trm041 trm043 trk048 trn006 trn007 trn016 trn017 trn019 trn025 trn030 trn031 trn033 trn035 trn040 trn041 trn042 trn045 trn050",
  expert: "trb001 tre009 tre011 trg033 trg043 trg044 trg049 trh001 trh006 trh007 trh008 trh019 trh020 trh030 tri004 tri008 tri009 tri010 trj003 trj004 trj009 trj020 trj021 trj026 trl006 trm004 trm010 trm014 trm021 trn011 trn014 trn021 trn023 trn046 trn048",
};

/** Reviewed Turkish question IDs, including records intentionally left unchanged. */
const reviewed = "t001 t002 t003 t004 t005 t006 t007 t008 t009 t010 t011 t012 t013 t014 t015 t016 t017 t018 t019 t020 f001 f002 f003 f004 f005 f006 f007 f008 f009 f010 f011 f012 f013 f014 f015 f016 f017 f018 f019 f020 trb002 trb003 trb004 trb006 trb007 trb008 trb009 trb010 trc001 trc002 trc003 trc004 trc005 trc006 trc007 trc008 trc009 trc010 trd002 trd003 trd004 trd005 trd006 trd008 trd009 trd010 trd011 trd012 trd013 trd014 trd015 trd016 trd017 trd018 trd019 trd020 tre001 tre002 tre003 tre004 tre005 tre006 tre008 tre009 tre010 tre011 tre012 tre013 tre014 tre015 tre016 tre017 tre018 tre019 tre020 trf001 trf002 trf003 trf004 trf005 trf006 trf007 trf008 trf009 trf010 trf012 trf013 trf014 trf016 trf017 trf019 trf020 trg002 trg003 trg004 trg006 trg007 trg008 trg009 trg010 trg012 trg013 trg014 trg015 trg016 trg017 trg018 trg019 trg020 trg021 trg022 trg023 trg024 trg025 trg026 trg027 trg028 trg029 trg030 trg032 trg033 trg035 trg036 trg038 trg039 trg040 trg041 trg042 trg043 trg044 trg045 trg046 trg047 trg048 trg049 trg050 trh001 trh002 trh003 trh004 trh006 trh007 trh008 trh009 trh010 trh012 trh013 trh014 trh015 trh016 trh017 trh019 trh020 trh021 trh022 trh023 trh024 trh025 trh026 trh027 trh028 trh029 trh030 trh032 trh033 trh034 trh035 trh036 trh037 trh039 trh040 trh043 trh044 trh045 trh047 trh048 trh049 trh050 tri002 tri003 tri004 tri005 tri006 tri007 tri008 tri009 tri010 tri012 tri013 tri014 tri015 tri016 tri017 tri018 tri019 tri020 tri022 tri023 tri024 tri025 tri026 tri027 tri028 tri029 tri030 tri032 tri033 tri034 tri035 tri036 tri038 tri039 tri040 tri041 tri042 tri043 tri044 tri045 tri046 tri047 tri048 tri049 tri050 trj002 trj003 trj004 trj005 trj006 trj007 trj009 trj010 trj012 trj013 trj014 trj015 trj016 trj017 trj018 trj019 trj020 trj021 trj022 trj023 trj024 trj025 trj026 trj028 trj029 trj030 trj032 trj033 trj034 trj035 trj037 trj038 trj039 trj040 trj042 trj044 trj046 trj047 trj049 trj050 trk003 trk004 trk005 trk006 trk007 trk008 trk009 trk010 trk012 trk013 trk014 trk015 trk016 trk017 trk018 trk019 trk020 trk022 trk023 trk024 trk025 trk026 trk028 trk029 trk030 trk032 trk033 trk034 trk035 trk037 trk038 trk039 trk040 trk042 trk043 trk044 trk046 trl002 trl003 trl005 trl006 trl007 trl008 trl010 trl012 trl013 trl015 trl016 trl018 trl019 trl021 trl022 trl024 trl025 trl027 trl028 trl030 trl031 trl032 trl034 trl035 trl036 trl038 trl039 trl040 trl041 trm002 trm003 trm004 trm005 trm006 trm007 trm008 trm009 trm010 trm011 trm013 trm014 trm016 trm017 trm018 trm019 trm020 trm021 trm022 trm023 trm024 trm025 trm026 trm027 trm028 trm029 trm031 trm032 trm033 trm034 trm035 trm036 trm037 trm038 trm039 trm040 trm041 trm042 trm043 trm045 trm046 trm047 trm048 trm049 trm050 trn002 trn003 trn004 trk047 trk048 trk049 trn005 trn006 trn007 trn009 trn010 trn011 trn012 trn013 trn014 trn015 trn016 trn017 trn018 trn019 trn020 trn021 trn023 trn024 trn025 trn026 trn027 trn028 trn030 trn031 trn032 trn033 trn034 trn035 trn037 trn038 trn039 trn040 trn041 trn042 trn043 trn045 trn046 trn047 trn048 trn049 trn050 trn051 trn052 trn053 trn054 trn055 trn056 trn057 trn058 trn059 trn060 trn061 trn062 trn063 trn064 trn065 tfe001 tfe002 tfe003 tfe004 tfe005 tfe006 tfe007 tfe008 tfe009 tfe010 tfe011 tfe012 tfe013 tfe014 tfe015 tfe016 tfe017 tfe018 tfe019 tfe020 tfe021 tfe022 tfe023 tfe024 tfe025 tfe026 tfe027 tfe028 tfe029 tfe030 tfe031 tfe032 tfe033 tfe034 tfe035 tfe036 tfe037 tfe038 tfe039 tfe040 tfe041 tfe042 tfe043 tfe044 tfe045 tfe046 tfe047 tfe048 tfe049 tfe050 tfe051 tfe052 tfe053 tfe054 tfe055 tfe056 tfe057 tfe058 tfe059 tfe060 tfe061 tfe062 tfe063 tfe064 tfe065 tfe066 tfe067 tfe068 tfe069 tfe070 tfe071 tfe072 tfe073 tfe074 tfe075 tfe076 tfe077 tfe078 tfe079 tfe080 tfe081 tfe082 tfe083 tfe084 tfe085 tfe086 tfe087 tfe088 tfe089 tfe090 tfe091 tfe092 tfe093 tfe094 tfe095 tfe096 tfe097 tfe098 tfe099 tfe100";
export const TURKISH_DIFFICULTY_REVIEWED_IDS: ReadonlySet<string> = new Set(reviewed.split(" "));

export const TURKISH_DIFFICULTY_CHANGES: ReadonlyMap<string, Difficulty> = (() => {
  const result = new Map<string, Difficulty>();
  for (const level of DIFFICULTIES) {
    for (const id of changes[level].split(" ").filter(Boolean)) {
      if (result.has(id)) throw new Error(`Duplicate Turkish difficulty review: ${id}`);
      result.set(id, level);
    }
  }
  return result;
})();

/** Apply only to the Turkish export; English legacy questions remain untouched. */
export function reviewTurkishDifficulties(pool: readonly Question[]): Question[] {
  const ids = new Set(pool.map(question => question.id));
  for (const id of TURKISH_DIFFICULTY_CHANGES.keys()) {
    if (!ids.has(id)) throw new Error(`Unknown Turkish difficulty review ID: ${id}`);
  }
  return pool.map(question => ({
    ...question,
    difficulty: TURKISH_DIFFICULTY_CHANGES.get(question.id) ?? question.difficulty,
  }));
}
