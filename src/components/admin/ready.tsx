import {
  ScanFace,
  BookOpenText,
  ChevronsLeftRight,
  Mail,
} from "lucide-react";

/**
 * Splash screen displayed when no resources are configured yet.
 *
 * Provides helpful links to Zing website and contact information.
 * Automatically shown when the admin app has no Resource children defined.
 */
export const Ready = () => (
  <div className="flex flex-col h-screen">
    <div
      className="flex-1 flex flex-col text-white text-center justify-center items-center"
      style={{
        background:
          "linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)",
      }}
    >
      <ScanFace className="w-32 h-32 mb-4" />
      <h1 className="text-3xl mb-4">Welcome to ZingIQ</h1>
      <div className="text-lg opacity-90">
        Your business intelligence platform is ready.
        <br />
        Now you can add a &lt;Resource&gt; as child of
        &lt;Admin&gt;&lt;/Admin&gt;
      </div>
    </div>
    <div className="flex h-[20vh] bg-secondary text-secondary-foreground items-center justify-evenly">
      <div className="text-xl">
        <a href="https://www.zing.work" className="hover:text-accent">
          <BookOpenText className="inline mr-4 w-10 h-10" />
          Learn More
        </a>
      </div>
      <div className="text-xl">
        <a href="https://www.zing.work/get-started" className="hover:text-accent">
          <ChevronsLeftRight className="inline mr-4 w-10 h-10" />
          Get Started
        </a>
      </div>
      <div className="text-xl">
        <a href="https://www.zing.work/contact" className="hover:text-accent">
          <Mail className="inline mr-4 w-10 h-10" />
          Contact Us
        </a>
      </div>
    </div>
  </div>
);
