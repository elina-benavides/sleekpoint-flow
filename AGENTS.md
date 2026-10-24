<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Business-specific presentation is gated through `supportsProductLocations`; keep location formatting in a browser-safe domain module so other business types remain unchanged.
- Business selection and location edits currently use a reactive session-only UI store; do not imply persistence or introduce backend storage without expanding the requested frontend scope.
