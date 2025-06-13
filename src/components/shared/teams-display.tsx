import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types/teams";


interface TeamDisplayProps {
    teams: Team[];
}

export function TeamsDisplay({ teams }: TeamDisplayProps) {
    return (
        <div className="flex-1 p-4 text-gray-100">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <Card key={team.name} className="overflow-hidden border-gray-700 bg-gray-800">
                        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold">{team.name}</CardTitle>
                                <Badge
                                    variant="secondary"
                                    className={`text-lg font-semibold ${
                                        team.top === 1
                                            ? "bg-yellow-400 text-gray-900"
                                            : team.top === 2
                                              ? "bg-gray-300 text-gray-900"
                                              : team.top === 3
                                                ? "bg-amber-600 text-gray-900"
                                                : "bg-white text-gray-900"
                                    }`}
                                >
                                    #{team.top}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-4">
                            <p className="mb-4 text-sm text-gray-400">{team.region.name}</p>
                            <h3 className="mb-2 font-semibold text-gray-200">Участники:</h3>
                            <ul className="space-y-2">
                                {team.members.map((member) => (
                                    <li key={member.fullName} className="flex items-center space-x-2">
                                        <Avatar className="h-8 w-8 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500" />
                                        <span className="text-gray-300">{member.fullName}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
