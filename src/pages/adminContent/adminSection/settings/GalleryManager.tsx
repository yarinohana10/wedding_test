
import React from "react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ExternalLink, Heart, Upload } from "lucide-react";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "preCeremony" | "ceremony" | "reception";
  featured: boolean;
}

interface GalleryManagerProps {
  existingImages: GalleryImage[];
  handleGalleryImagesChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    category: "preCeremony" | "ceremony" | "reception"
  ) => void;
  toggleImageFeatured: (imageId: number) => void;
  deleteImage: (imageId: number) => void;
  onDragEnd: (result: any) => void;
  getImagesByCategory: (
    category: "preCeremony" | "ceremony" | "reception"
  ) => GalleryImage[];
}

const GalleryManager: React.FC<GalleryManagerProps> = ({
  existingImages,
  handleGalleryImagesChange,
  toggleImageFeatured,
  deleteImage,
  onDragEnd,
  getImagesByCategory,
}) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
        <span>ניהול גלריית תמונות</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 mr-2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        העלה תמונות לגלריה וארגן אותן לפי קטגוריות. גרור תמונות לסידור
        מחדש וסמן עם לב כדי שיופיעו בקרוסלה.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Pre-Ceremony Category */}
        <div className="border p-3 rounded-lg">
          <h4 className="font-medium mb-3 text-center">
            לפני האירוע
          </h4>
          <div className="flex justify-center mb-3">
            <label
              htmlFor="pre-ceremony-upload"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>העלאת תמונות</span>
            </label>
            <input
              id="pre-ceremony-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleGalleryImagesChange(e, "preCeremony")
              }
              className="hidden"
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="preCeremony">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[200px]"
                >
                  {getImagesByCategory("preCeremony").map(
                    (image, index) => (
                      <Draggable
                        key={image.id}
                        draggableId={`pre-${image.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex bg-white p-2 rounded-md border shadow-sm"
                          >
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow flex flex-col mr-2 text-right">
                              <div className="text-sm truncate">
                                {image.alt}
                              </div>
                              <div className="flex gap-2 mt-auto">
                                <Button
                                  onClick={() =>
                                    toggleImageFeatured(image.id)
                                  }
                                  variant={
                                    image.featured
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="h-7 px-1 flex-1"
                                >
                                  <Heart
                                    className="h-3 w-3 ml-1"
                                    fill={
                                      image.featured
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                  {image.featured
                                    ? "מודגשת"
                                    : "לא מודגשת"}
                                </Button>
                                <Button
                                  onClick={() =>
                                    deleteImage(image.id)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive"
                                >
                                  <span className="sr-only">מחק</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Ceremony Category */}
        <div className="border p-3 rounded-lg">
          <h4 className="font-medium mb-3 text-center">חופה</h4>
          <div className="flex justify-center mb-3">
            <label
              htmlFor="ceremony-upload"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>העלאת תמונות</span>
            </label>
            <input
              id="ceremony-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleGalleryImagesChange(e, "ceremony")
              }
              className="hidden"
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="ceremony">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[200px]"
                >
                  {getImagesByCategory("ceremony").map(
                    (image, index) => (
                      <Draggable
                        key={image.id}
                        draggableId={`ceremony-${image.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex bg-white p-2 rounded-md border shadow-sm"
                          >
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow flex flex-col mr-2 text-right">
                              <div className="text-sm truncate">
                                {image.alt}
                              </div>
                              <div className="flex gap-2 mt-auto">
                                <Button
                                  onClick={() =>
                                    toggleImageFeatured(image.id)
                                  }
                                  variant={
                                    image.featured
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="h-7 px-1 flex-1"
                                >
                                  <Heart
                                    className="h-3 w-3 ml-1"
                                    fill={
                                      image.featured
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                  {image.featured
                                    ? "מודגשת"
                                    : "לא מודגשת"}
                                </Button>
                                <Button
                                  onClick={() =>
                                    deleteImage(image.id)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive"
                                >
                                  <span className="sr-only">מחק</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Reception Category */}
        <div className="border p-3 rounded-lg">
          <h4 className="font-medium mb-3 text-center">
            רחבת ריקודים
          </h4>
          <div className="flex justify-center mb-3">
            <label
              htmlFor="reception-upload"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>העלאת תמונות</span>
            </label>
            <input
              id="reception-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleGalleryImagesChange(e, "reception")
              }
              className="hidden"
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="reception">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[200px]"
                >
                  {getImagesByCategory("reception").map(
                    (image, index) => (
                      <Draggable
                        key={image.id}
                        draggableId={`reception-${image.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex bg-white p-2 rounded-md border shadow-sm"
                          >
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow flex flex-col mr-2 text-right">
                              <div className="text-sm truncate">
                                {image.alt}
                              </div>
                              <div className="flex gap-2 mt-auto">
                                <Button
                                  onClick={() =>
                                    toggleImageFeatured(image.id)
                                  }
                                  variant={
                                    image.featured
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="h-7 px-1 flex-1"
                                >
                                  <Heart
                                    className="h-3 w-3 ml-1"
                                    fill={
                                      image.featured
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                  {image.featured
                                    ? "מודגשת"
                                    : "לא מודגשת"}
                                </Button>
                                <Button
                                  onClick={() =>
                                    deleteImage(image.id)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive"
                                >
                                  <span className="sr-only">מחק</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => window.open("/gallery", "_blank")}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          <span>צפה בגלריה</span>
        </Button>
      </div>
    </div>
  );
};

export default GalleryManager;
