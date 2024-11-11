import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEnsStore } from "@/states/useEnsStore";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CreateSubnameFormProps } from "../types";

export const CreateSubnameForm = ({
  subname,
  onSubmit,
  onCancel,
  isSubmitting,
}: CreateSubnameFormProps) => {
  const { ensNames, fetchEnsNames } = useEnsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    parentName: subname?.parentName ?? "",
    label: subname?.label || "",
    texts: subname?.texts || [{ key: "", value: "" }],
    addresses: subname?.addresses || [{ coin: 60, value: "" }],
  });

  useEffect(() => {
    fetchEnsNames();
  }, [fetchEnsNames]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEnsNames =
    ensNames?.filter((ens) =>
      ens.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleEnsSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEnsSelect = (ensName: string) => {
    setFormData((prev) => ({
      ...prev,
      parentName: ensName,
    }));
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      label: e.target.value.toLowerCase(),
    }));
  };

  const handleAddText = () => {
    setFormData((prev) => ({
      ...prev,
      texts: [...prev.texts, { key: "", value: "" }],
    }));
  };

  const handleTextKeyChange = (index: number, value: string) => {
    const newTexts = [...formData.texts];
    newTexts[index].key = value;
    setFormData((prev) => ({ ...prev, texts: newTexts }));
  };

  const handleTextValueChange = (index: number, value: string) => {
    const newTexts = [...formData.texts];
    newTexts[index].value = value;
    setFormData((prev) => ({ ...prev, texts: newTexts }));
  };

  const handleRemoveText = (index: number) => {
    const newTexts = formData.texts.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, texts: newTexts }));
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { coin: 60, value: "" }],
    }));
  };

  const handleCoinTypeChange = (index: number, value: string) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index].coin = Number.parseInt(value);
    setFormData((prev) => ({ ...prev, addresses: newAddresses }));
  };

  const handleAddressValueChange = (index: number, value: string) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index].value = value;
    setFormData((prev) => ({ ...prev, addresses: newAddresses }));
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, addresses: newAddresses }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      texts: formData.texts.filter((t) => t.key && t.value),
      addresses: formData.addresses.filter((a) => a.value),
    };
    await onSubmit(data);
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label htmlFor="parentName" className="text-sm font-medium">
            Parent Name
          </label>
          <div className="relative" ref={dropdownRef}>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={handleToggleDropdown}
              disabled={!!subname}
            >
              <span className="truncate">
                {formData.parentName || "Select an ENS name..."}
              </span>
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen ? "transform rotate-180" : "",
                )}
              />
            </Button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search ENS names..."
                      className="w-full pl-8 pr-4 py-2 bg-background border rounded-md text-sm"
                      id="parentName"
                      value={searchTerm}
                      onChange={handleEnsSearchChange}
                    />
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredEnsNames.length > 0 ? (
                    filteredEnsNames.map((ens) => (
                      <button
                        key={ens.id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-accent text-sm"
                        onClick={() => handleEnsSelect(ens.name ?? "")}
                      >
                        {ens.name}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      {ensNames?.length === 0
                        ? "No ENS names found. Please make sure you are connected and own ENS names."
                        : "No matches found"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {formData.parentName && formData.label && (
            <p className="text-sm text-muted-foreground">
              Full name will be: {formData.label}.{formData.parentName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="subname" className="text-sm font-medium">
            Subname
          </label>
          <Input
            id="subname"
            placeholder="Enter your desired subname"
            value={formData.label}
            onChange={handleLabelChange}
            disabled={!!subname}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Texts</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddText}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Text
          </Button>
        </div>

        {formData.texts.map((text, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Key"
              value={text.key}
              onChange={(e) => handleTextKeyChange(index, e.target.value)}
            />
            <Input
              placeholder="Value"
              value={text.value}
              onChange={(e) => handleTextValueChange(index, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveText(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Addresses</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAddress}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {formData.addresses.map((address, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="number"
              placeholder="Coin Type"
              value={address.coin}
              onChange={(e) => handleCoinTypeChange(index, e.target.value)}
            />
            <Input
              placeholder="Address"
              value={address.value}
              onChange={(e) => handleAddressValueChange(index, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveAddress(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !formData.parentName || !formData.label}
          loading={isSubmitting}
        >
          {subname ? "Update Subname" : "Create Subname"}
        </Button>
      </div>
    </form>
  );
};
