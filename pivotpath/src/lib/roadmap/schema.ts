import { z } from "zod";

// Handed to Gemini's structured-output config as-is.
export const roadmapResponseJsonSchema = {
  type: "object",
  properties: {
    targetRole: {
      type: "string",
      description:
        "The specific job title this roadmap is built toward. If the person said they're still deciding, propose the single best-fit role based on their profile.",
    },
    milestones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Short milestone name, e.g. 'Complete a foundational certification'.",
          },
          description: {
            type: "string",
            description:
              "2-3 sentences on what to do in this milestone and why it matters given this specific person's background — not generic advice.",
          },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["targetRole", "milestones"],
} as const;

// Re-validated against this after parsing, independent of what the schema above actually enforced.
export const roadmapSchema = z.object({
  targetRole: z.string().trim().min(1),
  milestones: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      })
    )
    .min(4)
    .max(8),
});

export type RoadmapGeneration = z.infer<typeof roadmapSchema>;

export const roleSuggestionsResponseJsonSchema = {
  type: "object",
  properties: {
    roles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "A specific, real job title, e.g. 'Product Manager'.",
          },
          whyItFits: {
            type: "string",
            description:
              "1-2 sentences on why this role suits this specific person, referencing their skills, experience, interests, or motivation — not generic praise.",
          },
        },
        required: ["title", "whyItFits"],
      },
    },
  },
  required: ["roles"],
} as const;

export const roleSuggestionsSchema = z.object({
  roles: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        whyItFits: z.string().trim().min(1),
      })
    )
    .min(3),
});

export type RoleSuggestion = { title: string; whyItFits: string };

export const MILESTONE_STATUSES = ["todo", "in_progress", "done"] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];
