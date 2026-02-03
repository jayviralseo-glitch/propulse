import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Plus, X, Zap } from "lucide-react";

export default function SkillsSection({ profile, onAddSkill, onRemoveSkill }) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill("skills", newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Card className="card-modern hover-lift bg-gradient-to-br from-white to-green-50/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-medium">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Skills
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill..."
            className="flex-1 border-2 border-gray-200 rounded-2xl py-4 px-5 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
            onKeyPress={handleKeyPress}
          />
          <Button
            type="button"
            onClick={handleAddSkill}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-medium hover:shadow-large transition-all duration-300 rounded-2xl px-6 py-4 font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add
          </Button>
        </div>
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-2 border-green-200 text-green-700 bg-green-50 px-4 py-2 rounded-xl font-medium text-sm hover:bg-green-100 transition-all duration-300"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onRemoveSkill("skills", index)}
                  className="ml-3 hover:text-red-600 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {(!profile.skills || profile.skills.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No skills added yet</p>
            <p className="text-sm">
              Start adding your professional skills above
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
