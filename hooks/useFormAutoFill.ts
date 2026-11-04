import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormAutoFillParams {
  fieldsWatch: Array<string>;
  fields: Array<string>;
  form: UseFormReturn<any>;
}

// fieldsWatch are the form fields we want to autofill with fields

export const useFormAutoFill = ({ fieldsWatch, fields, form }: FormAutoFillParams) => {
  useEffect(() => {
    if (fieldsWatch.length !== fields.length) {
      console.warn('Fields arrays must have the same length.');
    }

    const subscription = form.watch((value, { name }) => {
      const areAllFieldsWatchFilled = fieldsWatch.every((field) => !!value[field]);

      const isAnyFieldsWatchDirty = fieldsWatch.some((field) => form.formState.dirtyFields[field]);

      if (areAllFieldsWatchFilled || isAnyFieldsWatchDirty) return;

      const areAllFieldsFilled = fields.every((field) => !!value[field]);

      if (fields.includes(name!) && areAllFieldsFilled) {
        fieldsWatch.forEach((field) => {
          const valueFromFields = value[fields[fieldsWatch.indexOf(field)]];
          form.setValue(field, valueFromFields);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [fieldsWatch, fields, form]);
};
