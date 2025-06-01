import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    menuItems: { name: string; icon: React.ElementType; id: string }[];
}

export function Sidebar({ activeSection, setActiveSection, menuItems }: SidebarProps) {
    return (
        <div className="w-64 print:hidden">
            <div className="sticky top-16 left-0 space-y-6 px-2 py-7 text-gray-100">
                <div className="flex flex-col">
                    {menuItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={cn(
                                "mb-2 w-full justify-start text-gray-100 hover:bg-gray-800",
                                activeSection === item.id && "bg-gray-900",
                            )}
                            onClick={() => {
                                setActiveSection(item.id);
                            }}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
