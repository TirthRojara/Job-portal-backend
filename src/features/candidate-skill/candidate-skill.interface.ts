
export interface IreadMySkill {
  skill: {
    id: number;
    name: string;
  };
}

export interface IreadAllCandidateSkillz extends IreadMySkill {
  candidateProfileId: number;
}
