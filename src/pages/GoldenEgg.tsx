import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { goldenEggs } from "@/lib/data/goldenEgg";
import { toast } from "react-toastify";

const GoldenEgg = () => {
  const [data, setData] = useState(goldenEggs);

  const [userIdSearch, setUserIdSearch] = useState("");
  const [isUsedFilter, setIsUsedFilter] = useState<"All" | "Yes" | "No">("All");

  const handleQuery = () => {
    let filtered = goldenEggs;

    if (userIdSearch) {
      filtered = filtered.filter((egg) =>
        egg.userId.toString().includes(userIdSearch)
      );
    }

    if (isUsedFilter !== "All") {
      filtered = filtered.filter((egg) => egg.isUsed === isUsedFilter);
    }

    setData(filtered);
  };

  const handleReset = () => {
    setUserIdSearch("");
    setIsUsedFilter("All");
    setData(goldenEggs);
  };

  const handleAdd = () => {
    toast("Add new Golden Egg reward (modal to be implemented)");
  };

  const handleEdit = (egg: (typeof goldenEggs)[0]) => {
    toast(`Edit Golden Egg ID: ${egg.id} for User ${egg.userId}`);
  };

  const handleDelete = (egg: (typeof goldenEggs)[0]) => {
    if (window.confirm(`Delete Golden Egg reward for User ${egg.userId}?`)) {
      setData(data.filter((item) => item.id !== egg.id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-primary-dark min-h-screen">
      {/* Search Bar */}
      <div className="bg-white dark:bg-primary-dark rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">User id</label>
            <Input
              placeholder="Please enter user id"
              value={userIdSearch}
              onChange={(e) => setUserIdSearch(e.target.value)}
            />
          </div>

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Is it used</label>
            <Select
              value={isUsedFilter}
              onValueChange={(value: "All" | "Yes" | "No") =>
                setIsUsedFilter(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Please choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleQuery}>Query</Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAdd}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-primary-dark rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-primary/60 sticky top-0 z-10">
                <TableHead className="text-center">Serial number</TableHead>
                <TableHead>User id</TableHead>
                <TableHead>Number of rewards</TableHead>
                <TableHead>Is it used</TableHead>
                <TableHead>Reward type</TableHead>
                <TableHead>Start singular</TableHead>
                <TableHead>Creation time</TableHead>
                <TableHead>Usage time</TableHead>
                <TableHead className="text-center">Operation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-10 text-gray-500"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((egg, index) => (
                  <TableRow key={egg.id}>
                    <TableCell className="text-center font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>{egg.userId}</TableCell>
                    <TableCell className="font-semibold">
                      {egg.numberOfRewards.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${egg.isUsed === "Yes"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {egg.isUsed}
                      </span>
                    </TableCell>
                    <TableCell>{egg.rewardType}</TableCell>
                    <TableCell>{egg.startSingular}</TableCell>
                    <TableCell>{egg.creationTime}</TableCell>
                    <TableCell>{egg.usageTime}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(egg)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(egg)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 border-t">
          <div className="text-sm text-gray-500">V1.0.81</div>
        </div>
      </div>
    </div>
  );
};

export default GoldenEgg;
