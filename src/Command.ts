export interface Command {
    enabled: boolean;
    call(): boolean;
    status(): number | boolean | null;
    message(): string | null;
}