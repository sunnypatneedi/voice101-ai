
import React from "react";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from "../../components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";
import { UseFormReturn } from "react-hook-form";

export type MeetingSettings = {
  compressRatio: number[];
  formatStyle: "Bullet" | "Narrative";
  includeSpeakers: "All" | "Tagged" | "None";
  transcript: string;
};

interface SummaryControlsProps {
  form: UseFormReturn<MeetingSettings>;
  onSubmit: (data: MeetingSettings) => Promise<void>;
  loading: boolean;
}

const SummaryControls: React.FC<SummaryControlsProps> = ({ form, onSubmit, loading }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="compressRatio"
            render={({ field }) => (
              <FormItem className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <FormLabel className="text-slate-200">Compression Ratio</FormLabel>
                <FormControl>
                  <div className="pt-2">
                    <Slider
                      value={field.value}
                      min={10}
                      max={90}
                      step={5}
                      onValueChange={field.onChange}
                      aria-label="Compression ratio"
                      className="w-full"
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-slate-400 text-center">
                  {field.value}% (Higher = More Detail)
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="formatStyle"
            render={({ field }) => (
              <FormItem className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <FormLabel className="text-slate-200">Format Style</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="Bullet" className="text-white focus:bg-blue-600 focus:text-white">Bullet Points</SelectItem>
                    <SelectItem value="Narrative" className="text-white focus:bg-blue-600 focus:text-white">Narrative</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="includeSpeakers"
            render={({ field }) => (
              <FormItem className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <FormLabel className="text-slate-200">Speaker Labels</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Speaker inclusion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="All" className="text-white focus:bg-blue-600 focus:text-white">All Speakers</SelectItem>
                    <SelectItem value="Tagged" className="text-white focus:bg-blue-600 focus:text-white">Tagged Only</SelectItem>
                    <SelectItem value="None" className="text-white focus:bg-blue-600 focus:text-white">No Speakers</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          size="lg"
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </Button>
      </form>
    </Form>
  );
};

export default SummaryControls;
