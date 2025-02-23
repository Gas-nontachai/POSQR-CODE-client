"use client";
import { AppBar, Drawer, Toolbar, Typography, IconButton, CssBaseline } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material"; // MUI icon for menu button
import Sidebar from "@/components/sidebar"; // Assuming you have your sidebar component
import "./globals.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noNavbarPages = ["/home", "/screen", "/menu-detail"];
  const [openSidebar, setOpenSidebar] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <html lang="en">
      <body className="relative">
        {/* Apply CssBaseline for consistent styling */}
        <CssBaseline />

        {!noNavbarPages.includes(pathname) && (
          <div className="flex">
            <Drawer
              open={openSidebar}
              onClose={toggleSidebar}
              variant="temporary"
              sx={{
                "& .MuiDrawer-paper": {
                  width: 240,
                },
              }}
            >
              <Sidebar />
            </Drawer>

            {/* Content with margin for sidebar */}
            <div className="flex flex-col w-full">
              <AppBar position="sticky" sx={{ backgroundColor: "#1f2937", zIndex: 2 }}>
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                    <MenuIcon />
                  </IconButton>
                  <span className="text-2xl font-bold">GGas</span>
                </Toolbar>
              </AppBar> 
              {/* Main Content */}
              <div >{children}</div>
            </div>
          </div>
        )}

        {/* If path matches noNavbarPages, render just the content */}
        {noNavbarPages.includes(pathname) && (
          <div className="w-full">{children}</div>
        )}
      </body>
    </html>
  );
}
