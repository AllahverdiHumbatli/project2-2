export class LikeCountCalculator {
    calculateExsistingIncriment(newLikeStatus: string, currentLikeCount: number, currentDislikeCount: number): {likesCount: number, dislikesCount: number} {
        const likeOrDislike = {
            likesCount: 0,
            dislikesCount: 0
        }
        switch (newLikeStatus) {
            case "Like":
                likeOrDislike.likesCount = 1
                likeOrDislike.dislikesCount = 0
                if( currentDislikeCount > 0 ){
                    likeOrDislike.likesCount = 1
                    likeOrDislike.dislikesCount = -1
                }
                return likeOrDislike

            case "Dislike":
                likeOrDislike.likesCount = 0
                likeOrDislike.dislikesCount = 1
                if(currentLikeCount > 0 ){
                    likeOrDislike.likesCount = -1
                    likeOrDislike.dislikesCount = 1
                }
                return likeOrDislike

            case "None":
                likeOrDislike.likesCount = 0
                likeOrDislike.dislikesCount = 0
                if(currentLikeCount > 0 ){
                    likeOrDislike.likesCount = -1
                    likeOrDislike.dislikesCount = 0
                }
                if( currentDislikeCount > 0 ){
                    likeOrDislike.likesCount = 0
                    likeOrDislike.dislikesCount = -1
                }
                return likeOrDislike
            default:
                return likeOrDislike
        }

    }

    calculateNew(newLikeStatus: string): {likesCount: number, dislikesCount: number} {
        const likeOrDislike = {
            likesCount: 0,
            dislikesCount: 0
        }
        switch (newLikeStatus) {
            case "Like":
                likeOrDislike.likesCount = 1
                likeOrDislike.dislikesCount = 0
                return likeOrDislike
            case "Dislike":
                likeOrDislike.likesCount = 0
                likeOrDislike.dislikesCount = 1
                return likeOrDislike
            case "None":
                likeOrDislike.likesCount = 0
                likeOrDislike.dislikesCount = 0
                return likeOrDislike
            default:
                return likeOrDislike

        }
    }
}