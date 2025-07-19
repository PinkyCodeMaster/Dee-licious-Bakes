export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Dee&apos;s Delicious Cakes</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-xl text-center text-muted-foreground mb-12">
            Creating beautiful, delicious cakes for life&apos;s special moments
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="mb-4">
                Welcome to Dee&apos;s Delicious Cakes! I&apos;m Dee, and I&apos;ve been passionate about baking for over 15 years. 
                What started as a hobby in my home kitchen has grown into a business dedicated to creating stunning, 
                delicious cakes for all of life&apos;s special celebrations.
              </p>
              <p className="mb-4">
                Every cake I create is made with love, using only the finest ingredients and attention to detail. 
                From elegant wedding cakes to fun birthday celebrations, I believe every occasion deserves a cake 
                that&apos;s as special as the moment itself.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="space-y-2">
                <li>🎂 Custom Birthday Cakes</li>
                <li>💒 Wedding Cakes</li>
                <li>🎉 Celebration Cakes</li>
                <li>🧁 Cupcakes & Treats</li>
                <li>🍰 Seasonal Specialties</li>
                <li>🎨 Custom Designs</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
            <p className="mb-4">
              Ready to create something sweet together? I&apos;d love to hear about your special occasion 
              and help bring your cake dreams to life.
            </p>
            <p className="text-muted-foreground">
              Contact us at: <a href="mailto:hello@deeliciousbakes.co.uk" className="text-primary hover:underline">
                hello@deeliciousbakes.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}