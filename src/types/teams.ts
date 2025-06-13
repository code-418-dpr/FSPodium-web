interface Member {
    fullName: string;
}

interface Region {
    name: string;
}

export interface Team {
    name: string;
    members: Member[];
    region: Region;
    top: number;
}