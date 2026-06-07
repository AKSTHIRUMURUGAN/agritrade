import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { verifyToken } from "@/app/lib/jwt";

const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Try to get the token from the Authorization header or cookie
      const authHeader = req.headers.get("authorization");
      const cookieHeader = req.headers.get("cookie") || "";

      let token: string | null = null;

      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      } else {
        // Parse auth_token from cookies
        const match = cookieHeader.match(/auth_token=([^;]+)/);
        if (match) token = match[1];
      }

      // Allow upload if token is valid — skip auth in development if no token
      if (token) {
        const decoded = verifyToken(token) as { userId?: string } | null;
        if (decoded?.userId) {
          return { userId: decoded.userId };
        }
      }

      // In production, require auth. In dev, allow anonymous uploads.
      if (process.env.NODE_ENV === "production" && !token) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: "anonymous" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // For multiple farm images
  farmImagesUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      const token = match ? match[1] : null;

      if (token) {
        const decoded = verifyToken(token) as { userId?: string } | null;
        if (decoded?.userId) return { userId: decoded.userId };
      }

      if (process.env.NODE_ENV === "production") {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: "anonymous" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
