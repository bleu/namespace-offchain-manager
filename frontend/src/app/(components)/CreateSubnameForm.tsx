import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { TOAST_MESSAGES } from "@/constants/toastMessages";
import { cn } from "@/lib/utils";
import { createSubnameSchema } from "@/schemas/subname.schema";
import { useEnsStore } from "@/states/useEnsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type * as z from "zod";
import type { CreateSubnameFormProps } from "../types";

type FormValues = z.infer<typeof createSubnameSchema>;

export const CreateSubnameForm = ({
  subname,
  onSubmit,
  onCancel,
  isSubmitting,
  isAuthenticated,
}: CreateSubnameFormProps) => {
  const { ensNames, fetchEnsNames } = useEnsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(createSubnameSchema),
    defaultValues: {
      parentName: subname?.parentName ?? "",
      label: subname?.label || "",
      texts: subname?.texts?.length ? subname.texts : [],
      addresses: subname?.addresses?.length ? subname.addresses : [],
      subscriptionPackId: subname?.subscriptionPack?.id ?? "",
    },
    mode: "onChange",
  });

  const {
    fields: textFields,
    append: appendText,
    remove: removeText,
  } = useFieldArray({
    control: form.control,
    name: "texts",
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: "addresses",
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

  const handleEnsSelect = (ensName: string) => {
    form.setValue("parentName", ensName, { shouldValidate: true });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleAddText = () => {
    if (!isAuthenticated) {
      toast(TOAST_MESSAGES.error.authentication);
      return;
    }
    if (textFields.length >= 50) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 50 text records allowed",
      });
      return;
    }
    appendText({ key: "", value: "" });
  };

  const handleAddAddress = () => {
    if (!isAuthenticated) {
      toast(TOAST_MESSAGES.error.authentication);
      return;
    }
    if (addressFields.length >= 20) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 20 address records allowed",
      });
      return;
    }
    appendAddress({ coin: 60, value: "" });
  };

  const handleSubmit = async (values: FormValues) => {
    if (!isAuthenticated) {
      toast(TOAST_MESSAGES.error.authentication);
      return;
    }

    const filteredData = {
      ...values,
      texts: values.texts.filter((t) => t.key && t.value),
      addresses: values.addresses.filter((a) => a.value),
    };

    await onSubmit(filteredData);
  };

  const isFormValid =
    form.watch("parentName") &&
    form.watch("label") &&
    !form.formState.errors.parentName &&
    !form.formState.errors.label;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              onClick={() => setIsOpen(!isOpen)}
              disabled={!!subname}
            >
              <span className="truncate">
                {form.watch("parentName") || "Select an ENS name..."}
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
          {form.formState.errors.parentName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.parentName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="label" className="text-sm font-medium">
            Subname
          </label>
          <Input
            {...form.register("label")}
            placeholder="Enter your desired subname"
            disabled={!!subname}
            onChange={(e) =>
              form.setValue("label", e.target.value.toLowerCase(), {
                shouldValidate: true,
              })
            }
          />
          {form.formState.errors.label && (
            <p className="text-sm text-destructive">
              {form.formState.errors.label.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Texts (Optional)</h3>
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

        {textFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Input
                {...form.register(`texts.${index}.key`)}
                placeholder="Key"
              />
              {form.formState.errors.texts?.[index]?.key && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.texts[index]?.key?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <Input
                {...form.register(`texts.${index}.value`)}
                placeholder="Value"
              />
              {form.formState.errors.texts?.[index]?.value && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.texts[index]?.value?.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeText(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Addresses (Optional)</h3>
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

        {addressFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <div className="w-1/3 space-y-1">
              <Input
                type="number"
                {...form.register(`addresses.${index}.coin`, {
                  valueAsNumber: true,
                })}
                placeholder="Coin Type"
              />
              {form.formState.errors.addresses?.[index]?.coin && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.addresses[index]?.coin?.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <Input
                {...form.register(`addresses.${index}.value`)}
                placeholder="Address"
              />
              {form.formState.errors.addresses?.[index]?.value && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.addresses[index]?.value?.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeAddress(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {form.watch("parentName") && form.watch("label") && (
        <p className="text-sm text-muted-foreground">
          Full name will be: {form.watch("label")}.{form.watch("parentName")}
        </p>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          loading={isSubmitting}
        >
          {subname ? "Update Subname" : "Create Subname"}
        </Button>
      </div>
    </form>
  );
};
