"use client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Avatar className="h-24 w-24 mx-auto">
          <AvatarImage src={session?.user?.image || "/default-user.png"} alt="User" />
          <AvatarFallback><User size={35} /></AvatarFallback>
        </Avatar>
        <div>
          <p><strong>Email:</strong> {session?.user?.email}</p>
          <p><strong>Token:</strong> {session?.accessToken ? "Token mavjud" : "Token mavjud emas"}</p>
        </div>
      </CardContent>
    </Card>
  );
}





// "use client";
// import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { api } from "@/lib/api";
// import { useSession } from "next-auth/react";
// import { User } from "lucide-react";

// export default function ProfilePage() {
//   const { data: session } = useSession();
//   const [form, setForm] = useState({
//     name: session?.user?.name || "",
//     avatar: session?.user?.image || "/default-user.png",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await api.put("/profile", form);
//   };

//   return (
//     <div className="space-y-4">
//       <Avatar className="h-24 w-24">
//         <AvatarImage src={form.avatar} alt="User" />
//         <AvatarFallback><User /></AvatarFallback>
//       </Avatar>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <Input
//           type="file"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               const reader = new FileReader();
//               reader.onloadend = () => {
//                 setForm({ ...form, avatar: reader.result as string });
//               };
//               reader.readAsDataURL(file);
//             }
//           }}
//         />
//         <Button type="submit">Update Profile</Button>
//       </form>
//     </div>
//   );
// }


