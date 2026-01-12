import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Welcome = () => (
  <Card>
    <CardHeader className="px-4">
      <CardTitle>Welcome to ZingIQ</CardTitle>
    </CardHeader>
    <CardContent className="px-4">
      <p className="text-sm mb-4">
        <a
          href="https://www.zing.work"
          className="underline hover:no-underline text-accent"
        >
          ZingIQ
        </a>{" "}
        is your all-in-one business intelligence platform for small businesses.
      </p>
      <p className="text-sm mb-4">
        Manage contacts, track deals, analyze customer behavior, and make data-driven
        decisions to grow your business faster.
      </p>
      <p className="text-sm">
        Powered by{" "}
        <a
          href="https://www.zing.work"
          className="underline hover:no-underline text-accent"
        >
          Zing
        </a>
        , the everyday hero for small business owners.
      </p>
    </CardContent>
  </Card>
);
