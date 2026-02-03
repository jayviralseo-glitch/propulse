import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/use-toast";
import api from "../../services/api";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  FileText,
  Eye,
  Trash2,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  Edit3,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  ArrowUpDown,
  Send,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

export default function History() {
  const [proposals, setProposals] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedProposals, setExpandedProposals] = useState(new Set());
  const { currentUser, backendUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch proposals history
      const proposalsData = await api.get("/api/history");
      if (proposalsData.success) {
        setProposals(proposalsData.history || []);
      } else {
        setProposals([]);
      }

      // Fetch profiles for filtering
      const profilesData = await api.get("/api/profiles");
      if (profilesData.success) {
        setProfiles(profilesData.profiles || []);
      } else {
        setProposals([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setProposals([]);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter proposals based on search and filters
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      searchTerm === "" ||
      proposal.jobDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      proposal.profileId?.profileName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesProfile =
      selectedProfile === "all" || proposal.profileId?._id === selectedProfile;

    return matchesSearch && matchesProfile;
  });

  // Sort by timestamp (newest first)
  const sortedProposals = [...filteredProposals].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const toggleProposalExpansion = (proposalId) => {
    const newExpanded = new Set(expandedProposals);
    if (newExpanded.has(proposalId)) {
      newExpanded.delete(proposalId);
    } else {
      newExpanded.add(proposalId);
    }
    setExpandedProposals(newExpanded);
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Background Pattern Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Floating dots */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div
          className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-green-400/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 sm:mb-4">
              Proposal History
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Track your proposal performance and success rates over time
            </p>
          </div>

          {/* Summary Stats */}
          <Card className="card-modern hover-lift bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto shadow-medium">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl opacity-20 blur-lg"></div>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">
                    {proposals.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    Total Proposals
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto shadow-medium">
                      <Send className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl opacity-20 blur-lg"></div>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">
                    {proposals.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    Total Proposals
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto shadow-medium">
                      <Edit3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg sm:rounded-xl opacity-20 blur-lg"></div>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 mb-1">
                    {
                      proposals.filter(
                        (p) =>
                          new Date(p.createdAt) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    This Week
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto shadow-medium">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl opacity-20 blur-lg"></div>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mb-1">
                    {profiles.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    Profiles Used
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="card-modern hover-lift bg-gradient-to-br from-white to-green-50/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <Input
                    placeholder="Search proposals by job description or profile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-base sm:text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>

                {/* Profile Filter */}
                <Select
                  value={selectedProfile}
                  onValueChange={setSelectedProfile}
                >
                  <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-base sm:text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
                    <SelectValue placeholder="All Profiles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Profiles</SelectItem>
                    {profiles.map((profile) => (
                      <SelectItem key={profile._id} value={profile._id}>
                        {profile.firstName} {profile.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-4 sm:space-y-6">
            {sortedProposals.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 hidden sm:block rounded-full"></div>

                {sortedProposals.map((proposal, index) => (
                  <div key={proposal._id} className="relative">
                    <Card className="card-modern hover-lift bg-gradient-to-br from-white to-purple-50/30 ml-0 sm:ml-16">
                      <CardContent className="p-4 sm:p-6 lg:p-8">
                        <div className="flex items-start gap-3 sm:gap-6">
                          {/* Timeline dot - visible on desktop */}
                          <div className="absolute -left-16 top-8 hidden sm:flex items-center justify-center w-12 h-12 bg-white border-4 border-blue-500 rounded-full shadow-medium">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <Badge
                                  variant="outline"
                                  className="border-2 border-green-200 text-green-700 bg-green-50 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm"
                                >
                                  Generated
                                </Badge>
                                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                  {formatTimeAgo(proposal.createdAt)}
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                                {formatFullDate(proposal.createdAt)}
                              </div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                  {proposal.profileId?.profileName ||
                                    "Unknown Profile"}
                                </h3>
                                {proposal.profileId && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-2 border-green-200 w-fit"
                                  >
                                    {proposal.profileId.profession ||
                                      "Developer"}
                                  </Badge>
                                )}
                              </div>
                              {/* Show proposal URL if available - positioned above job description */}
                              {proposal.proposalUrl && (
                                <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                  <span className="text-gray-600 font-medium">
                                    Source:
                                  </span>
                                  <a
                                    href={proposal.proposalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 break-all"
                                  >
                                    {proposal.proposalUrl}
                                  </a>
                                </div>
                              )}

                              {/* Job Description with See More/See Less */}
                              <div className="mb-3 sm:mb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                                    Job Description:
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs sm:text-sm hover:bg-gray-50 hover:text-gray-700 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 transition-all duration-300 w-fit"
                                    onClick={() =>
                                      toggleProposalExpansion(
                                        proposal._id + "_description"
                                      )
                                    }
                                  >
                                    {expandedProposals.has(
                                      proposal._id + "_description"
                                    )
                                      ? "See Less"
                                      : "See More"}
                                  </Button>
                                </div>
                                <div className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                                  {expandedProposals.has(
                                    proposal._id + "_description"
                                  ) ? (
                                    <div className="whitespace-pre-wrap">
                                      {proposal.jobDescription}
                                    </div>
                                  ) : (
                                    <p className="line-clamp-3">
                                      {proposal.jobDescription}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Show generated proposal preview */}
                              {proposal.generatedProposal && (
                                <div className="mt-3 sm:mt-4 p-3 sm:p-4 lg:p-6 bg-white/60 rounded-xl sm:rounded-2xl border-2 border-gray-100">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
                                    <h4 className="text-base sm:text-lg font-bold text-gray-800">
                                      Generated Proposal:
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-700 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1 sm:py-2 transition-all duration-300 w-fit"
                                      onClick={() =>
                                        toggleProposalExpansion(proposal._id)
                                      }
                                    >
                                      {expandedProposals.has(proposal._id)
                                        ? "Show Less"
                                        : "Show More"}
                                    </Button>
                                  </div>

                                  <div className="text-gray-600 text-sm sm:text-base">
                                    {expandedProposals.has(proposal._id) ? (
                                      <div className="whitespace-pre-wrap">
                                        {proposal.generatedProposal}
                                      </div>
                                    ) : (
                                      <p className="line-clamp-3">
                                        {proposal.generatedProposal}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-700 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1 sm:py-2 transition-all duration-300 w-fit"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          proposal.generatedProposal
                                        );
                                        toast({
                                          title: "Proposal copied!",
                                          description:
                                            "Generated proposal copied to clipboard.",
                                        });
                                      }}
                                    >
                                      Copy Full Proposal
                                    </Button>

                                    <div className="text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 font-medium">
                                      <span>
                                        {proposal.generatedProposal.length}{" "}
                                        characters
                                      </span>
                                      {proposal.metadata && (
                                        <>
                                          <span className="hidden sm:inline">
                                            •
                                          </span>
                                          <span>
                                            Model:{" "}
                                            {proposal.metadata.model ||
                                              "Unknown"}
                                          </span>
                                          <span className="hidden sm:inline">
                                            •
                                          </span>
                                          <span>
                                            Generated:{" "}
                                            {new Date(
                                              proposal.metadata.generationTime
                                            ).toLocaleString()}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center gap-1 sm:gap-2 font-medium">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                  Generated
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="card-modern bg-gradient-to-br from-white to-purple-50/30">
                <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
                  <div className="flex flex-col items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                      <FileText className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                        No Proposals Found
                      </h3>
                      <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
                        {searchTerm || selectedProfile !== "all"
                          ? "No proposals match your current filters."
                          : "No proposals have been generated yet."}
                      </p>
                      {(searchTerm || selectedProfile !== "all") && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedProfile("all");
                          }}
                          className="border-2 border-gray-200 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-2 sm:py-3 font-medium hover:border-blue-300 hover:text-blue-700 transition-all duration-300 text-sm sm:text-base"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
