export type MemoNode = {
    id: string;
    title: string;
    body: string;
    isOpen: boolean;
    children: MemoNode[];
};
