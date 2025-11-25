"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useCountries } from "@lib/hooks/use-contries";

type CountryComboboxProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function CountryCombobox({
  value,
  onChange,
  placeholder = "국가를 선택하세요",
}: CountryComboboxProps) {
  const { getAll, getByValue } = useCountries();
  const countries = getAll();

  const [open, setOpen] = React.useState(false);

  const selectedCountry = value ? getByValue(value) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2 text-sky-300">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.label}</span>
              <span className="text-xs text-sky-300">
                ({selectedCountry.region})
              </span>
            </span>
          ) : (
            <span className="text-sky-300">{placeholder}</span>
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-10000 w-[280px] p-0">
        <Command>
          <CommandInput placeholder="국가 이름 검색..." />
          <CommandList className="max-h-64 overflow-y-auto">
            <CommandEmpty>해당하는 국가가 없습니다.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                >
                  <span className="mr-2">{country.flag}</span>
                  <span className="mr-2">{country.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {country.region}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      country.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
