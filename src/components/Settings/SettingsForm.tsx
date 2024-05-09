"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { defaultSettings, zodSettingsFormSchema } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";

const formSchema = zodSettingsFormSchema();

export function SettingsForm() {
  const { toast } = useToast();
  const { setTheme } = useTheme();

  const getLocalStorage = (): z.infer<typeof formSchema> => {
    const localSt = window.localStorage.getItem(
      "scsseco-s-rhyme-schemes-settings",
    );

    if (!localSt) return defaultSettings;

    return JSON.parse(localSt);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultSettings,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedVal = getLocalStorage();

      console.log(savedVal.mode);

      form.setValue("autoplay", savedVal.autoplay);
      form.setValue("repeat", savedVal.repeat);
      form.setValue("mode", savedVal.mode);

      form.getValues();

      console.log(form.getValues());

      if (savedVal.mode) setTheme(savedVal.mode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);

    window.localStorage.setItem(
      "scsseco-s-rhyme-schemes-settings",
      JSON.stringify(values),
    );

    setTheme(values.mode);

    toast({
      variant: "default",
      duration: 2000,
      title: "Ura!",
      description: "Setarile au fost salvate",
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="autoplay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Autoplay</FormLabel>
                  <FormDescription>
                    Sa inceapa melodia imediat ce intri pe pagina
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Repeat</FormLabel>
                  <FormDescription>
                    Cand ajungi la ultima piesa din playlist s-o ia de la
                    inceput.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start  gap-4 space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormLabel>Tema</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="light"
                          checked={field.value === "light"}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Light</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="dark"
                          checked={field.value === "dark"}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Dark</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="system"
                          checked={field.value === "system"}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">System</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Salveaza</Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
}
