import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0 to 5
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumber?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  totalReviews,
  size = "md",
  interactive = false,
  onRatingChange,
  showNumber = true,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = starIndex <= Math.round(currentVal);
          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${
                interactive ? "cursor-pointer hover:scale-110 transition-transform p-0.5" : "cursor-default"
              }`}
            >
              <Star
                className={`${starSizes[size]} ${
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs font-semibold text-slate-700">
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      )}

      {totalReviews !== undefined && (
        <span className="text-xs text-slate-400">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
