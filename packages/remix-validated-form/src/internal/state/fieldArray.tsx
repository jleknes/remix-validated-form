import React, { useMemo, createContext } from "react";
import invariant from "tiny-invariant";
import { InternalFormContextValue } from "../formContext";
import {
  useCurrentDefaultValueForField,
  useInternalFormContext,
} from "../hooks";
import { useRegisterControlledField } from "./controlledFields";
import { useFormStore } from "./storeHooks";

const useFieldArray = (context: InternalFormContextValue, field: string) => {
  const value = useCurrentDefaultValueForField(context.formId, field);
  useRegisterControlledField(context, field);

  const arr = useFormStore(
    context.formId,
    (state) => state.controlledFields.array
  );

  const helpers = useMemo(
    () => ({
      push: (item: any) => {
        arr.push(field, item);
      },
      swap: (indexA: number, indexB: number) => {
        arr.swap(field, indexA, indexB);
      },
      move: (from: number, to: number) => {
        arr.move(field, from, to);
      },
      insert: (index: number, value: any) => {
        arr.insert(field, index, value);
      },
      unshift: (value: any) => {
        arr.unshift(field, value);
      },
      remove: (index: number) => {
        arr.remove(field, index);
      },
      pop: () => {
        arr.pop(field);
      },
      replace: (index: number, value: any) => {
        arr.replace(field, index, value);
      },
    }),
    [arr, field]
  );

  return [value, helpers] as const;
};

export const FieldArrayContext = createContext<{
  defaultValues: any[];
  name: string;
} | null>(null);

export type FieldArrayHelpers = {
  push: (item: any) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: any) => void;
  unshift: (value: any) => void;
  remove: (index: number) => void;
  pop: () => void;
  replace: (index: number, value: any) => void;
};

export type FieldArrayProps = {
  name: string;
  children: (
    itemDefaults: any[],
    helpers: FieldArrayHelpers
  ) => React.ReactNode;
  formId?: string;
};

export const FieldArray = ({ name, children, formId }: FieldArrayProps) => {
  const context = useInternalFormContext(formId, "FieldArray");
  const [value, helpers] = useFieldArray(context, name);

  invariant(
    value === undefined || value === null || Array.isArray(value),
    `FieldArray: defaultValue value for ${name} must be an array, null, or undefined`
  );

  const contextValue = useMemo(
    () => ({ defaultValues: value ?? [], name }),
    [name, value]
  );

  return (
    <FieldArrayContext.Provider value={contextValue}>
      {children(contextValue.defaultValues, helpers)}
    </FieldArrayContext.Provider>
  );
};
