
import React from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../components/ui/form";

export interface TesterFormValues {
  testCommand: string;
  contextLines: string;
  errorMode: string;
}

interface TestConfigFormProps {
  onSubmit: SubmitHandler<TesterFormValues>;
  isLoading: boolean;
  form: UseFormReturn<TesterFormValues>;
}

const TestConfigForm: React.FC<TestConfigFormProps> = ({ onSubmit, isLoading, form }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Test Configuration</CardTitle>
            <CardDescription className="text-slate-300">
              Configure your voice assistant test parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="testCommand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Test Command</FormLabel>
                  <FormDescription className="text-slate-400">
                    Select a command to test the assistant's recognition
                  </FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select a command" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="PlayMusic">Play Music</SelectItem>
                      <SelectItem value="SetTimer">Set Timer</SelectItem>
                      <SelectItem value="GetWeather">Get Weather</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contextLines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Context Depth</FormLabel>
                  <FormDescription className="text-slate-400">
                    How many previous conversation lines to include
                  </FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select context depth" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="0">0 (No context)</SelectItem>
                      <SelectItem value="1">1 line</SelectItem>
                      <SelectItem value="2">2 lines</SelectItem>
                      <SelectItem value="3">3 lines</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="errorMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Error Mode</FormLabel>
                  <FormDescription className="text-slate-400">
                    Type of error to introduce into the command
                  </FormDescription>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select error mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="AddNoise">Add Noise</SelectItem>
                      <SelectItem value="BadGrammar">Bad Grammar</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-medium py-6"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Run Test"}
        </Button>
      </form>
    </Form>
  );
};

export default TestConfigForm;
