import { BlockedDate } from "@/types/business-hours";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, CalendarX2 } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface ClosedDateTableProps {
  data: BlockedDate[];
  onAdd: () => void;
  onEdit: (date: BlockedDate) => void;
  onDelete: (id: string) => void;
}

export function ClosedDateTable({ data, onAdd, onEdit, onDelete }: ClosedDateTableProps) {
  if (data.length === 0) {
    return <EmptyState onAdd={onAdd} />;
  }

  // Determine status (Upcoming or Past)
  const getStatus = (dateString: string) => {
    const isPast = new Date(dateString).getTime() < new Date().setHours(0, 0, 0, 0);
    return isPast ? "Past" : "Upcoming";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Special Closed Dates</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage holidays, vacations, and emergency closures.</p>
        </div>
        <Button onClick={onAdd} className="w-full sm:w-auto">
          <CalendarX2 className="h-4 w-4 mr-2" />
          Add Closed Date
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const status = getStatus(item.date);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {format(new Date(item.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-zinc-500 dark:text-zinc-400">
                    {item.reason}
                  </TableCell>
                  <TableCell>
                    {status === "Upcoming" ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                        Upcoming
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20">
                        Past
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      >
                        <span className="sr-only">Edit</span>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <span className="sr-only">Delete</span>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item) => {
          const status = getStatus(item.date);
          return (
            <div key={item.id} className="flex flex-col p-4 gap-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {format(new Date(item.date), "MMM d, yyyy")}
                </span>
                {status === "Upcoming" ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                    Upcoming
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20">
                    Past
                  </Badge>
                )}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.reason}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="bg-white dark:bg-zinc-950 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="bg-white dark:bg-zinc-950 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
