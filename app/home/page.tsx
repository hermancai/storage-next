"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function HomePage() {
  const supabase = createClientComponentClient();

  // const createFolder = async () => {
  //   const res = await supabase
  //     .from("folder")
  //     .insert({ name: "test", parent: null });
  //   console.log(res);
  // };

  return (
    <div>
      <p>Home page (logged in)</p>
      {/* <button onClick={createFolder}>create folder</button> */}
    </div>
  );
}
