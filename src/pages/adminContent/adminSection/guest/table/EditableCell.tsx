
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableCellProps {
  value: string | number;
  onChange: (value: string | number) => void;
  onSave: () => void;
  type: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  className?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  onSave,
  type,
  options = [],
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave();
  };

  if (isEditing) {
    if (type === "select") {
      return (
        <Select
          value={String(value)}
          onValueChange={(val) => {
            onChange(val);
            setIsEditing(false);
            onSave();
          }}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
              onSave();
            }
          }}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`h-8 min-w-[80px] text-right ${className}`}
        min={type === "number" ? 1 : undefined}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors flex items-center"
    >
      <span className="flex-1">{value}</span>
      <Edit className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 mr-1" />
    </div>
  );
};

export default EditableCell;
