import Link from "next/link";

const Footer = () => {
	return (
		<footer className="bg-gray-50 py-8 border-t border-gray-200">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">CleanEase</h3>
						<p className="text-muted-foreground">
							Professional cleaning services for your home or business.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-muted-foreground hover:text-cleaning-600 text-sm"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/#services"
									className="text-muted-foreground hover:text-cleaning-600 text-sm"
								>
									Services
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard"
									className="text-muted-foreground hover:text-cleaning-600 text-sm"
								>
									Book Now
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4">Contact</h3>
						<p className="text-muted-foreground text-sm">
							123 Galle Road,
							<br />
							Dehiwala-Mount Lavinia
						</p>
						<p className="text-muted-foreground text-sm mt-2">
							<a href="mailto:info@cleanease.com">info@cleanease.com</a>
							<br />
							<a href="tel:+94111234567">+94 11 123 4567</a>
						</p>
					</div>
				</div>
				<div className="border-t border-gray-200 mt-8 pt-6 text-center">
					<p className="text-gray-500 text-sm">
						© {new Date().getFullYear()} CleanEase. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
