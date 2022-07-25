export interface Message {
    // Indicates if the result is successful or not
    succeeded: boolean;

    // The text or icon to display
    content?: string;

    // Milliseconds that the message display should last for
    duration?: number;
}