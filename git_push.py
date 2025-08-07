#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Un script simple et intelligent pour automatiser le processus git add, commit et push.
Il gère automatiquement les erreurs courantes comme les dépôts distants manquants
ou les branches amont (upstream) non configurées.
"""

import subprocess
import sys
import os

# --- Configuration ---
# The correct repository URL for this project.
CORRECT_REPO_URL = "https://github.com/WistantKode/Responsivewebsite-chickfood"
PROJECT_NAME = "Responsivewebsite-chickfood"

def execute(command):
    """
    Exécute une commande, affiche sa sortie et retourne un tuple :
    (succes_booleen, sortie_erreur_string).
    """
    print(f"\n> {' '.join(command)}")
    process = subprocess.run(command, text=True, capture_output=True, encoding='utf-8')

    if process.stdout:
        print(process.stdout.strip())
    if process.stderr:
        # Affiche stderr, car Git l'utilise souvent pour des informations de progression.
        print(process.stderr.strip())

    success = process.returncode == 0
    if not success:
        print(f"--- Command failed with exit code {process.returncode} ---")

    return success, process.stderr.lower()

def get_output(command, check=True):
    """
    Exécute une commande et retourne sa sortie standard (stdout).
    Si check=True, le script s'arrêtera en cas d'échec.
    """
    try:
        result = subprocess.run(
            command,
            check=check,
            text=True,
            capture_output=True,
            encoding='utf-8'
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        if check:  # Critical error
            print(f"Erreur fatale lors de l'exécution de : {' '.join(command)}")
            print(f"Erreur : {e.stderr}")
            sys.exit(1)
        return None

def check_and_set_remote():
    """
    Checks if the remote 'origin' is correctly configured.
    If not, it either configures it automatically or prompts to correct it.
    Returns False on failure, True otherwise.
    """
    print("--- 1. Checking Remote Repository URL ---")

    existing_url = get_output(["git", "config", "--get", "remote.origin.url"], check=False)

    if existing_url:
        if existing_url.strip() == CORRECT_REPO_URL:
            print("Remote 'origin' is correctly configured.")
            return True
        else:
            print(f"Warning: Remote 'origin' points to incorrect URL: {existing_url}")
            choice = input(f"Do you want to correct it to {CORRECT_REPO_URL}? [Y/n] : ").lower().strip()
            if choice in ('', 'y', 'yes'):
                success, _ = execute(["git", "remote", "set-url", "origin", CORRECT_REPO_URL])
                if success:
                    print(f"Remote URL updated to: {CORRECT_REPO_URL}")
                    return True
                else:
                    print("Failed to update remote URL.")
                    new_url = input("Please enter the correct repository URL: ").strip()
                    success, _ = execute(["git", "remote", "set-url", "origin", new_url])
                    if success:
                        print(f"Remote URL updated to: {new_url}")
                        return True
            else:
                print("Remote URL update cancelled. Push may fail.")
                return True
    else:
        print("Remote 'origin' not found. Attempting to add...")
        success, _ = execute(["git", "remote", "add", "origin", CORRECT_REPO_URL])
        return success

def main():
    """Main function orchestrating the push process."""

    if not os.path.isdir(".git"):
        print("Error: This script must be run at the root of a Git repository.")
        sys.exit(1)

    print(f"Initiating automated push for project: {PROJECT_NAME}")

    if not check_and_set_remote():
        print("Failed to configure remote repository. Aborting.")
        sys.exit(1)

    print("\n--- 2. Indexing Files ---")
    status_output = get_output(["git", "status", "--porcelain"])

    if status_output:
        print("Changes detected. Indexing all files (`git add .`)")
        success, _ = execute(["git", "add", "."])
        if not success:
            print("Failed to index files. Aborting.")
            sys.exit(1)
    else:
        print("No changes detected in the working directory.")
        # Check for untracked files, but do not fail if none are found.
        untracked_files = get_output(["git", "ls-files", "--others", "--exclude-standard"], check=False)
        if untracked_files:
            print("Untracked files found. Adding them to the index.")
            success, _ = execute(["git", "add", "."])  # Add all untracked files
        else:
            print("Working directory clean. Nothing to commit.")
            sys.exit(1)

    print("\n--- 3. Creating Commit ---")
    commit_message = input("Enter your commit message (or leave empty for default): ").strip()
    if not commit_message:
        commit_message = f"feat: Automatic update for project {PROJECT_NAME}"
    
    success, _ = execute(["git", "commit", "-m", commit_message])
    if not success:
        print("Commit failed, possibly due to no new changes to commit.")
        sys.exit(1)  # It's an error if files were added but commit fails

    print("\n--- 4. Pushing to GitHub ---")
    current_branch = get_output(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    
    success, stderr = execute(["git", "push", "origin", current_branch])
    
    if success:
        print("\nPush successful! All changes are on GitHub.")
        return

    if "has no upstream branch" in stderr:
        print(f"Remote branch '{current_branch}' does not exist. Attempting to create...")
        success, _ = execute(["git", "push", "--set-upstream", "origin", current_branch])
        if success:
            print(f"\nSuccess! Remote branch created and now tracking.")
        else:
            print(f"\nPush failed again. Please check your repository permissions.")
    elif "authentication failed" in stderr:
        print("\nPush failed: Authentication error!")
        print("Please verify your credentials (Personal Access Token, SSH key).")
    elif "push declined" in stderr or "protected branch" in stderr:
        print("\nPush failed: Push declined or protected branch restrictions.")
        print(f"You may not have permission to push directly to '{current_branch}'.")
        print("Consider creating a pull request or pushing to a different branch.")
    else:
        print("\nPush failed: An unexpected error occurred.")

if __name__ == "__main__":
    main()