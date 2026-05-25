import {
  MAX_RANK,
  RANK_ORDER,
  REQUIRED_CONSECUTIVE_WINS_TO_RANK_UP,
  UserRank,
} from "../../shared/constants/rank.constants";

export class RankingService {
  static getNextRank(currentRank: string): UserRank {
    const currentIndex = RANK_ORDER.indexOf(currentRank as UserRank);

    if (currentIndex === -1) {
      return RANK_ORDER[0];
    }

    const nextRank = RANK_ORDER[currentIndex + 1];

    return nextRank ?? MAX_RANK;
  }

  static shouldRankUp(rank: string, consecutiveWins: number): boolean {
    return (
      rank !== MAX_RANK &&
      consecutiveWins >= REQUIRED_CONSECUTIVE_WINS_TO_RANK_UP
    );
  }

  static calculateLoserConsecutiveWins(currentConsecutiveWins: number): number {
    return Math.max(currentConsecutiveWins - 1, 0);
  }
}