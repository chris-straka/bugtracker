# Pnpm 

`pnpm fetch` is similar to `pnpm install`, except it only uses the pnpm-lock.yaml file and not the package.json file. 

They created `pnpm fetch` because of an issue with the package.json file. Whenever you changed something small that was unrelated to your dependencies (name, author, description, etc), docker will interpret that file as a totally different file and re-run the multi-stage build wherever that file is introduced as a dependency in the build. This means it will re-install all your dependencies regardless if any of them changed. 

I may be incorrect on that, but I think that's what it's meant for.