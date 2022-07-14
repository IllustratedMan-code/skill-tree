{
  description = "A very basic flake";


  inputs = {
    mach-nix.url = "mach-nix/3.5.0";
    base16 = {
    url = "github:base16-project/base16-schemes";
    flake = false;
    };

  };

  outputs = { self, nixpkgs, mach-nix, base16 }:
    let 
        target_system = "x86_64-linux";
        format = "org";
        pkgs = import nixpkgs {system=target_system;};
        mkPython = mach-nix.lib."${target_system}".mkPython {
          requirements = ''
          '';
        };
        mkPythonShell = mach-nix.lib."${target_system}".mkPython {
          requirements = ''
            python-lsp-server
            black
          '';

        };
    in
  rec{
    packages."${target_system}" = with pkgs; {
      default = stdenv.mkDerivation rec {
        name = "skill-tree";
        buildInputs = [pandoc yaml2json mkPython nodePackages.http-server which ];
        src = ./.;
        installPhase = ''
            mkdir $out
            for f in ${base16}/*.yaml
            do
              filename=''${f%.yaml}
              filename=''${filename##*/}
              file="$filename:\n"
              theme=$file"$(cat $f | sed 's/^/  /';)"
              printf "$theme\n" >> base16.yaml
            done
            ls ${base16} > $out/files.txt
            links=$(cat ${src}/theme/testlinks.html)
            pandoc -f ${format} -t html -c theme/theme.css --toc --template theme/theme.html -o $out/index.html -B theme/header.html -A theme/footer.html wiki.org -V links="$links"
            cp -r ${src}/theme $out/theme
            mkdir $out/base16
            yaml2json < base16.yaml > $out/base16/base16.json
            mkdir $out/bin
            echo "#!/usr/bin/env bash" >> "$out/bin/skill-tree"
            echo "exec $(which http-server) $out" >> "$out/bin/skill-tree"
            chmod +x $out/bin/skill-tree
        '';
      };
    };
    devShells.${target_system} = with pkgs; rec{
      default = mkShell{
        buildInputs = [sumneko-lua-language-server nodePackages.http-server mkPythonShell nodePackages.yaml-language-server] ++ packages.${target_system}.default.buildInputs;
      };
    };
  };
}
