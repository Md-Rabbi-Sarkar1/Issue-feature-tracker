export type TUser = {
    id: number,
    name: string,
    email: string,
    password: string,
    role?: string,
    created_at: Date,
    updated_at: Date
}
export type RUser = Omit<TUser, "id" | "created_at" | "updated_at">
export type SUser = Omit<TUser, "password">
export type LUser = {
    email: string,
    password: string
}
export const role = ["contributor", "maintainer"] as const
export type Role = typeof role[number]
export type TIssue = {
    id: number,
    title: string,
    description: string,
    type: "bug" | "feature_request",
    status: "open" | "in_progress" | "resolved",
    created_at: Date,
    updated_at: Date
}
export type UIssue = Omit<TIssue,"id"|"status"|"created_at"|"updated_at">