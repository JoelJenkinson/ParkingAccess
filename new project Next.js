# Create a new Next.js project with TypeScript
npx create-next-app@latest parking-garage --typescript --tailwind
cd parking-garage

# Install the necessary packages
npm install lucide-react @radix-ui/react-tabs @radix-ui/react-alert-dialog @radix-ui/react-slot

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Install the required components-+
npx shadcn-ui@latest add alert card tabs input button