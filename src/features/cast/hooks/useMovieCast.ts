import { useEffect, useState } from "react";
import { getMovieCast } from "../services/castApi";
import type { CastMember } from "../types";

export function useMovieCast(id?: string) {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const movieId = Number(id);
        if (!movieId) throw new Error("Invalid movie ID.");

        const data = await getMovieCast(movieId);
        if (active) setCast(data.cast);
      } catch (err) {
        if (!active) return;
        console.error("Cast error:", err);
        setError(err instanceof Error ? err.message : "Unable to load cast.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [id]);

  return { cast, loading, error };
}
