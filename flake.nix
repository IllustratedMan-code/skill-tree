{
  description = "A very basic flake";


  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: 
    let 
        target_system = "x86_64-linux";
        format = "org";
        pkgs = import nixpkgs {system=target_system;};
    in
  {
    packages.x86_64-linux = with pkgs; {
      default = stdenv.mkDerivation rec {
        name = "skill-tree";
        buildInputs = [pandoc];
        src = ./.;
        installPhase = ''
            mkdir $out
            pandoc -f ${format} -t html -c theme/theme.css --toc --template theme/theme.html -o $out/index.html -B theme/header.html -A theme/footer.html wiki.org
            cp -r ${src}/theme $out/theme
        '';
      };
    };
  };
}
