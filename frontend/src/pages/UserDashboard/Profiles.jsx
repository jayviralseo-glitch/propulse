import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Header from "../../components/Header";

export default function Profiles() {
  const { currentUser, backendUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 5;

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchProfiles = async () => {
    try {
      const data = await api.get("/api/profiles");
      if (data.success) {
        setProfiles(data.profiles || []);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setProfiles([]);
      toast({
        title: "Error",
        description: "Failed to fetch profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter((profile) => {
    const searchLower = searchTerm.toLowerCase();

    // Simple test - just check if searchTerm exists
    if (!searchTerm) return true;

    const matches =
      profile.profileName?.toLowerCase().includes(searchLower) ||
      profile.firstName?.toLowerCase().includes(searchLower) ||
      profile.lastName?.toLowerCase().includes(searchLower) ||
      profile.skills?.some((skill) =>
        skill.toLowerCase().includes(searchLower)
      );

    return matches;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProfiles = filteredProfiles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (profile) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await api.delete(`/api/profiles/${profileToDelete._id}`);

      if (result.success) {
        toast({
          title: "Profile deleted",
          description: `${profileToDelete.profileName} has been successfully deleted.`,
        });
        // Remove from local state
        setProfiles(profiles.filter((p) => p._id !== profileToDelete._id));
      } else {
        throw new Error(result.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Professional Profiles
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Manage your professional profiles and skills
              </p>
            </div>
            <Link to="/profiles/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto btn-modern bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-large hover:shadow-hover transition-all duration-300 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Create Profile
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <Card className="card-modern hover-lift bg-gradient-to-br from-white to-blue-50/30 mb-4 sm:mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      placeholder="Search profiles by name, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-base sm:text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profiles Table - Desktop */}
          <div className="hidden lg:block">
            <Card className="card-modern hover-lift bg-gradient-to-br from-white to-purple-50/30">
              <CardContent className="p-0">
                {filteredProfiles.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-white">
                        <TableHead className="font-semibold text-gray-700 p-6">
                          Profile Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 p-6">
                          Full Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 p-6">
                          Profession
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 p-6">
                          Skills
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 p-6">
                          Created
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right p-6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProfiles.map((profile) => (
                        <TableRow
                          key={profile._id}
                          className="hover:bg-white/60 transition-all duration-300"
                        >
                          <TableCell className="font-semibold text-gray-900 p-6">
                            {profile.profileName}
                          </TableCell>
                          <TableCell className="text-gray-700 p-6">
                            {profile.firstName} {profile.lastName}
                          </TableCell>
                          <TableCell className="text-gray-700 p-6">
                            {profile.profession}
                          </TableCell>
                          <TableCell className="p-6">
                            <div className="flex flex-wrap gap-2">
                              {profile.skills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-sm border-2 border-blue-200 text-blue-700 bg-blue-50 px-3 py-1 rounded-xl font-medium"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              {profile.skills.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-sm border-2 border-purple-200 text-purple-700 bg-purple-50 px-3 py-1 rounded-xl font-medium"
                                >
                                  +{profile.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 p-6">
                            {formatDate(profile.createdAt)}
                          </TableCell>
                          <TableCell className="text-right p-6">
                            <div className="flex items-center justify-end space-x-3">
                              <Link to={`/profiles/${profile._id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-10 w-10 p-0 hover:bg-green-50 rounded-xl transition-all duration-300"
                                >
                                  <Edit className="h-5 w-5 text-green-600" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 p-0 hover:bg-red-50 rounded-xl transition-all duration-300 text-red-600"
                                onClick={() => handleDelete(profile)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Users className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No profiles found
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      {searchTerm
                        ? "No profiles match your search criteria."
                        : "Get started by creating your first professional profile."}
                    </p>
                    {!searchTerm && (
                      <Link to="/profiles/new">
                        <Button className="btn-modern bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-large hover:shadow-hover transition-all duration-300 rounded-2xl px-8 py-4 text-lg font-semibold">
                          <Plus className="h-5 w-5 mr-3" />
                          Create Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profiles Cards - Mobile */}
          <div className="lg:hidden">
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paginatedProfiles.map((profile) => (
                  <Card
                    key={profile._id}
                    className="card-modern hover-lift bg-gradient-to-br from-white to-purple-50/30"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                            {profile.profileName}
                          </h3>
                          <p className="text-gray-700 text-sm mb-2">
                            {profile.firstName} {profile.lastName}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs border-2 border-blue-200 text-blue-700 bg-blue-50 px-2 py-1 rounded-lg font-medium"
                          >
                            {profile.profession}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <Link to={`/profiles/${profile._id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-green-50 rounded-lg transition-all duration-300"
                            >
                              <Edit className="h-4 w-4 text-green-600" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 rounded-lg transition-all duration-300 text-red-600"
                            onClick={() => handleDelete(profile)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {profile.skills.slice(0, 3).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border border-blue-200 text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-medium"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border border-purple-200 text-purple-700 bg-purple-50 px-2 py-1 rounded-md font-medium"
                            >
                              +{profile.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created: {formatDate(profile.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="card-modern bg-gradient-to-br from-white to-purple-50/30">
                <CardContent className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    No profiles found
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                    {searchTerm
                      ? "No profiles match your search criteria."
                      : "Get started by creating your first professional profile."}
                  </p>
                  {!searchTerm && (
                    <Link to="/profiles/new">
                      <Button className="btn-modern bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-large hover:shadow-hover transition-all duration-300 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold">
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                        Create Profile
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="card-modern bg-gradient-to-br from-white to-green-50/30 mt-4 sm:mt-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-gray-700 font-medium text-center sm:text-left text-sm sm:text-base">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredProfiles.length
                    )}{" "}
                    of {filteredProfiles.length} results
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-full sm:w-auto border-2 border-gray-200 rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-medium hover:border-blue-300 hover:text-blue-700 transition-all duration-300 text-sm sm:text-base"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-medium rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-semibold text-sm"
                                : "border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-medium hover:border-blue-300 hover:text-blue-700 transition-all duration-300 text-sm"
                            }
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-full sm:w-auto border-2 border-gray-200 rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-medium hover:border-blue-300 hover:text-blue-700 transition-all duration-300 text-sm sm:text-base"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl sm:rounded-3xl mx-4 sm:mx-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl font-bold">
              Delete Profile
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base sm:text-lg">
              Are you sure you want to delete "{profileToDelete?.profileName}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-semibold shadow-medium hover:shadow-large transition-all duration-300 text-sm sm:text-base"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
