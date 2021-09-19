export interface Command {
    enabled: boolean;
    call(): Promise<boolean>;
    status(): Promise<number | boolean | null>;
    message(): Promise<string | null>;
}