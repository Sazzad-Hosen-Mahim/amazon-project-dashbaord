import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

export type FilterKey = "userId" | "mobileMantissa" | "name" | "ip" | "userType";


interface SearchFiltersProps {
    filters: {
        userId: string;
        mobileMantissa: string;
        name: string;
        ip: string;
        userType?: string;
    };
    onFilterChange: (key: FilterKey, value: string | undefined) => void;
    onSearch: () => void;
    onReset: () => void;
}

const SearchFilters = ({ filters, onFilterChange, onSearch, onReset }: SearchFiltersProps) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    placeholder="Please enter the user ID"
                    value={filters.userId}
                    onChange={(e) => onFilterChange("userId", e.target.value)}
                />
                <Input
                    placeholder="Please enter the four-digit mantissa"
                    value={filters.mobileMantissa}
                    onChange={(e) => onFilterChange("mobileMantissa", e.target.value)}
                />
                <Input
                    placeholder="Please enter your name"
                    value={filters.name}
                    onChange={(e) => onFilterChange("name", e.target.value)}
                />
                <Input
                    placeholder="Please enter the ip address"
                    value={filters.ip}
                    onChange={(e) => onFilterChange("ip", e.target.value)}
                />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <Select
                    value={filters.userType}
                    onValueChange={(value) => onFilterChange("userType", value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Please select the type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={onSearch}>Query</Button>
                <Button variant="outline" onClick={onReset}>Reset</Button>
            </div>
        </>
    );
};

export default SearchFilters;