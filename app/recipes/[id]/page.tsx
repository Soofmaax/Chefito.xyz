'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Users, ChefHat, Play, Heart, Share2, ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Image } from '@/components/ui/Image';
import { VoicePlayer } from '@/components/features/VoicePlayer';
import { VoiceGuidedCooking } from '@/components/features/VoiceGuidedCooking';
import { PremiumGate } from '@/components/features/PremiumGate';
import { useToast } from '@/components/ui/Toast';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { apiService } from '@/services/api';
import { Recipe } from '@/types';

// Required for static export
export async function generateStaticParams() {
  // Generate static params for known recipe IDs
  // In a real app, you'd fetch this from your API
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '550e8400-e29b-41d4-a716-446655440001' },
    { id: '550e8400-e29b-41d4-a716-446655440002' },
    { id: '550e8400-e29b-41d4-a716-446655440003' },
  ];
}

export default function RecipeDetailPage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const { showToast } = useToast();
  const { isPremium, getFreeRecipesRemaining, markRecipeAsUsed } = useRevenueCat();

  useEffect(() => {
    if (params.id) {
      loadRecipe(params.id as string);
    }
  }, [params.id]);

  const loadRecipe = async (id: string) => {
    try {
      setLoading(true);
      const recipeData = await apiService.getRecipe(id);
      setRecipe(recipeData);
      
      // Mark recipe as used for free users (if they can access it)
      const recipeIndex = parseInt(id) - 1; // Assuming sequential IDs
      if (!isPremium && recipeIndex < 2) {
        markRecipeAsUsed();
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Recipe Not Found',
        message: 'The requested recipe could not be loaded.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    showToast({
      type: 'success',
      title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
      message: isFavorited ? 'Recipe removed from your favorites' : 'Recipe saved to your favorites',
    });
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share && recipe) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          showToast({
            type: 'success',
            title: 'Link Copied',
            message: 'Recipe link copied to clipboard',
          });
        }
      }
    } else if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Recipe link copied to clipboard',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BoltBadge />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading recipe..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BoltBadge />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
            <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
            <Link href="/recipes">
              <Button icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Recipes
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user can access this recipe
  const recipeIndex = parseInt(params.id as string) - 1;
  const canAccess = isPremium || recipeIndex < 2;

  // If user can't access, show premium gate
  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BoltBadge />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/recipes">
              <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Recipes
              </Button>
            </Link>
          </div>

          <PremiumGate feature="cette recette complète" showPreview={true}>
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
                  <p className="text-xl text-white/90">{recipe.description}</p>
                </div>
              </div>
            </div>
          </PremiumGate>
        </div>

        <Footer />
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/recipes">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Recipes
            </Button>
          </Link>
        </div>

        {/* Free Recipe Notice */}
        {!isPremium && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Free Recipe Access</h3>
                <p className="text-green-700 text-sm">
                  You're viewing one of your {getFreeRecipesRemaining() + 1} free recipes. 
                  <Link href="/pricing" className="underline ml-1">Upgrade to Premium</Link> for unlimited access.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[recipe.difficulty]}`}>
                  {recipe.difficulty}
                </span>
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
              <p className="text-xl text-white/90">{recipe.description}</p>
            </div>
          </div>

          {/* Recipe Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card padding="sm" className="text-center">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Prep Time</div>
              <div className="font-bold">{recipe.prep_time}m</div>
            </Card>
            <Card padding="sm" className="text-center">
              <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Cook Time</div>
              <div className="font-bold">{recipe.cook_time}m</div>
            </Card>
            <Card padding="sm" className="text-center">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Servings</div>
              <div className="font-bold">{recipe.servings}</div>
            </Card>
            <Card padding="sm" className="text-center">
              <ChefHat className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Total Time</div>
              <div className="font-bold">{totalTime}m</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1 md:flex-none"
              icon={<Play className="w-5 h-5" />}
              onClick={() => setShowVoiceGuide(!showVoiceGuide)}
            >
              {showVoiceGuide ? 'Masquer le guidage' : 'Guidage vocal étape par étape'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleFavorite}
              icon={<Heart className={`w-5 h-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />}
            >
              {isFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleShare}
              icon={<Share2 className="w-5 h-5" />}
            >
              Share
            </Button>
          </div>

          {/* Voice Guided Cooking Component */}
          {showVoiceGuide && (
            <VoiceGuidedCooking recipe={recipe} className="mb-8" />
          )}

          {/* Simple Voice Player for Introduction */}
          {!showVoiceGu # Ericsson/codechecker
# -------------------------------------------------------------------------
#
#  Part of the CodeChecker project, under the Apache License v2.0 with
#  LLVM Exceptions. See LICENSE for license information.
#  SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
#
# -------------------------------------------------------------------------
"""
Defines the CodeChecker action for parsing a set of analysis results into a
human-readable format.
"""

import argparse
import os
import sys
from typing import Dict, List, Optional, Set, Tuple

from codechecker_report_converter.report import report_file, \
    reports as reports_helper
from codechecker_report_converter.report.output import baseline, codeclimate, \
    gerrit, json as report_to_json, plaintext
from codechecker_report_converter.report.output.html import \
    html as report_to_html
from codechecker_report_converter.report.statistics import Statistics

from codechecker_common import arg, logger
from codechecker_common.source_code_comment_handler import \
    SourceCodeCommentHandler
from codechecker_common.skiplist_handler import SkipListHandler
from codechecker_common.util import load_json

from codechecker_analyzer import analyzer_context, suppress_handler

LOG = logger.get_logger('system')


def init_logger(level, logger_name='system'):
    logger.setup_logger(level, logger_name)
    logger.setup_logger(level, 'report-converter')


# Replacing the argument parser of the parse command.
def get_argparser_ctor_args():
    """
    This method returns a dict containing the kwargs for constructing an
    argparse.ArgumentParser (either directly or as a subparser).
    """

    return {
        'prog': 'CodeChecker parse',
        'formatter_class': arg.RawDescriptionDefaultHelpFormatter,

        # Description is shown when the command's help is queried directly
        'description': """
Parse and pretty-print the summary and results from one or more
'codechecker-analyze' result files. Bugs which are commented by using
"false_positive", "suppress" and "intentional" source code comments will not be
printed by the `parse` command.""",

        # Help is shown when the "parent" CodeChecker command lists the
        # individual subcommands.
        'help': "Print analysis summary and results in a human-readable format."
    }


def add_arguments_to_parser(parser):
    """
    Add the subcommand's arguments to the given argparse.ArgumentParser.
    """

    parser.add_argument('input',
                        type=str,
                        nargs='+',
                        metavar='file/folder',
                        help="The analysis result files and/or folders "
                             "containing analysis results which should be "
                             "parsed and printed.")

    parser.add_argument('-t', '--type', '--input-format',
                        dest="input_format",
                        required=False,
                        choices=['plist'],
                        default='plist',
                        help="Specify the format the analysis results were "
                             "created as.")

    output_opts = parser.add_argument_group("export arguments")
    output_opts.add_argument('-e', '--export',
                             dest="export",
                             required=False,
                             choices=['html', 'json', 'codeclimate', 'gerrit',
                                      'baseline'],
                             help="Specify extra output format type.")

    output_opts.add_argument('-o', '--output',
                             dest="output_path",
                             default=argparse.SUPPRESS,
                             help="Store the output in the given folder.")

    output_opts.add_argument('--url',
                             type=str,
                             dest="trim_path_prefix",
                             default=argparse.SUPPRESS,
                             help="Path prefix to trim when exporting "
                                  "to html.")

    parser.add_argument('--suppress',
                        type=str,
                        dest="suppress",
                        default=argparse.SUPPRESS,
                        required=False,
                        help="Path of the suppress file to use. Records in the "
                             "suppress file are used to suppress the "
                             "display of certain results when parsing the "
                             "analyses' report. (Reports to an analysis "
                             "result can also be suppressed in the source "
                             "code -- please consult the manual on how to "
                             "do so.) NOTE: The suppress file relies on the "
                             "\"bug identifier\" generated by the analyzers "
                             "which is unique for every analyzer.")

    parser.add_argument('--export-source-suppress',
                        dest="create_suppress",
                        action="store_true",
                        required=False,
                        default=argparse.SUPPRESS,
                        help="Write suppress data from the suppression "
                             "annotations found in the source files that were "
                             "analyzed earlier that created the results. "
                             "The suppression information will be written "
                             "to the parameter of '--suppress'.")

    parser.add_argument('--print-steps',
                        dest="print_steps",
                        action="store_true",
                        required=False,
                        default=argparse.SUPPRESS,
                        help="Print the steps the analyzers took in finding "
                             "the reported defect.")

    parser.add_argument('--verbose',
                        type=str,
                        dest='verbose',
                        choices=logger.CMDLINE_LOG_LEVELS,
                        default=argparse.SUPPRESS,
                        help="Set verbosity level. If not set, the default is "
                             f"'{logger.DEFAULT_LOG_LEVEL}'.")

    parser.add_argument('--trim-path-prefix',
                        type=str,
                        nargs='*',
                        dest="trim_path_prefix",
                        required=False,
                        default=argparse.SUPPRESS,
                        help="Removes leading path from files which will be "
                             "printed. For instance if you analyze files "
                             "'/home/jsmith/my-proj/x.cpp' and "
                             "'/home/jsmith/my-proj/y.cpp', but would prefer "
                             "to see just 'x.cpp' and 'y.cpp' in the output, "
                             "then please add: "
                             "--trim-path-prefix \"/home/jsmith/my-proj/\"")

    parser.add_argument('--review-status',
                        nargs='*',
                        dest="review_status",
                        metavar='REVIEW_STATUS',
                        choices=["confirmed", "false_positive", "intentional",
                                 "suppress", "unreviewed"],
                        required=False,
                        default=["confirmed", "unreviewed"],
                        help="Filter results by review status. Valid values "
                             "are: 'confirmed', 'false_positive', "
                             "'intentional', 'suppress', 'unreviewed'. "
                             "If multiple values are given, the results of "
                             "each type will be printed.")

    group = parser.add_argument_group("file filter arguments")

    group.add_argument('-i', '--ignore', '--skip',
                       dest="skipfile",
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Path to the Skipfile dictating which project "
                            "files should be omitted from analysis. Please "
                            "consult the User guide on how a Skipfile "
                            "should be laid out.")

    group.add_argument('--file',
                       nargs='+',
                       dest="files",
                       metavar='FILE',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Filter results by file path. "
                            "The file path can contain multiple * "
                            "quantifiers which matches any number of "
                            "characters (zero or more). So if you have "
                            "/a/x.cpp and /a/y.cpp then \"/a/*.cpp\" "
                            "selects both.")

    group.add_argument('--checker-name',
                       nargs='+',
                       dest="checker_names",
                       metavar='CHECKER_NAME',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Filter results by checker names. "
                            "The checker name can contain multiple * "
                            "quantifiers which matches any number of "
                            "characters (zero or more). So for example "
                            "\"*DeadStores\" will matches "
                            "\"deadcode.DeadStores\"")

    group.add_argument('--checker-msg',
                       nargs='+',
                       dest="checker_msgs",
                       metavar='CHECKER_MSG',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Filter results by checker messages."
                            "The checker message can contain multiple * "
                            "quantifiers which matches any number of "
                            "characters (zero or more).")

    group.add_argument('--severity',
                       nargs='+',
                       dest="severities",
                       metavar='SEVERITY',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Filter results by severities.")

    group.add_argument('--report-hash',
                       nargs='+',
                       dest="report_hashes",
                       metavar='REPORT_HASH',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Filter results by report hashes.")

    group.add_argument('--detection-status',
                       nargs='+',
                       dest="detection_statuses",
                       metavar='DETECTION_STATUS',
                       choices=['new', 'reopened', 'unresolved', 'resolved',
                                'off', 'unavailable'],
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Filter results by detection statuses.")

    group.add_argument('--review-status-rule',
                       dest='review_status_rule',
                       metavar='REVIEW_STATUS_RULE',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="The path of the review status rule JSON file "
                            "which can be used to apply review status rules "
                            "on the reports based on the report line, "
                            "checker name, file path, message text or "
                            "source code comments.")

    group.add_argument('--open-reports-date',
                       dest='open_reports_date',
                       metavar='TIMESTAMP',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Show all of the reports that were alive at "
                            "TIMESTAMP. The format of TIMESTAMP is "
                            "'year:month:day:hour:minute:second' "
                            "(the \"time\" part can be omitted, in which "
                            "case midnight (00:00:00) is used).")

    group.add_argument('--detected-before',
                       dest='detected_before',
                       metavar='TIMESTAMP',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Show all of the reports that were detected "
                            "before TIMESTAMP. The format of TIMESTAMP is "
                            "'year:month:day:hour:minute:second' "
                            "(the \"time\" part can be omitted, in which "
                            "case midnight (00:00:00) is used).")

    group.add_argument('--detected-after',
                       dest='detected_after',
                       metavar='TIMESTAMP',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Show all of the reports that were detected "
                            "after TIMESTAMP. The format of TIMESTAMP is "
                            "'year:month:day:hour:minute:second' "
                            "(the \"time\" part can be omitted, in which "
                            "case midnight (00:00:00) is used).")

    group.add_argument('--fixed-before',
                       dest='fixed_before',
                       metavar='TIMESTAMP',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Show all of the reports that were fixed "
                            "before TIMESTAMP. The format of TIMESTAMP is "
                            "'year:month:day:hour:minute:second' "
                            "(the \"time\" part can be omitted, in which "
                            "case midnight (00:00:00) is used).")

    group.add_argument('--fixed-after',
                       dest='fixed_after',
                       metavar='TIMESTAMP',
                       required=False,
                       default=argparse.SUPPRESS,
                       help="Show all of the reports that were fixed "
                            "after TIMESTAMP. The format of TIMESTAMP is "
                            "'year:month:day:hour:minute:second' "
                            "(the \"time\" part can be omitted, in which "
                            "case midnight (00:00:00) is used).")

    parser.add_argument('--statistics',
                        dest="statistics",
                        action="store_true",
                        required=False,
                        default=argparse.SUPPRESS,
                        help="Show the statistics of the reports.")


def parse(args):
    """
    Parses the report files provided in the command line.
    """
    logger.setup_logger(args.verbose if 'verbose' in args else None)
    init_logger(args.verbose if 'verbose' in args else None)

    export = args.export if 'export' in args else None
    if export == 'html' and 'output_path' not in args:
        LOG.error("Argument --output path is required for HTML output!")
        sys.exit(1)

    context = analyzer_context.get_context()

    # To ensure the help message prints the default folder properly,
    # the 'default' for 'args.input' is a string, not a list.
    # But we need lists for the foreach here to work.
    if isinstance(args.input, str):
        args.input = [args.input]

    original_cwd = os.getcwd()

    suppress_handler_obj = None
    if 'suppress' in args:
        __make_handler = False
        if not os.path.isfile(args.suppress):
            if 'create_suppress' in args:
                with open(args.suppress, 'w',
                          encoding='utf-8', errors='ignore') as _:
                    # Just create the file.
                    __make_handler = True
                    LOG.info("Will write source-code suppressions to "
                             "suppress file: %s", args.suppress)
            else:
                LOG.warning("Suppress file '%s' given, but it does not exist"
                            " -- will not suppress anything.",
                            args.suppress)
        else:
            __make_handler = True

        if __make_handler:
            suppress_handler_obj = suppress_handler.GenericSuppressHandler(
                args.suppress,
                'create_suppress' in args)
    elif 'create_suppress' in args:
        LOG.error("Can't use '--export-source-suppress' unless '--suppress "
                  "SUPPRESS_FILE' is also given.")
        sys.exit(2)

    # Setup source code comment handling.
    source_comment_status_filter = set()
    if 'review_status' in args:
        source_comment_status_filter = set(args.review_status)

    skip_handler = None
    if 'skipfile' in args:
        skip_handler = SkipListHandler(args.skipfile)

    trim_path_prefixes = []
    if 'trim_path_prefix' in args:
        trim_path_prefixes = args.trim_path_prefix

    if export == 'html':
        output_path = os.path.abspath(args.output_path)
        if not os.path.exists(output_path):
            os.makedirs(output_path)

    all_reports = []
    statistics = Statistics()
    file_cache = {}
    review_status_rule = None
    if 'review_status_rule' in args:
        review_status_rule = load_json(args.review_status_rule, {})

    for input_path in args.input:
        input_path = os.path.abspath(input_path)
        os.chdir(original_cwd)
        LOG.debug("Parsing input argument: '%s'", input_path)

        if os.path.isfile(input_path):
            files = [input_path]
        elif os.path.isdir(input_path):
            files = []
            for f in os.listdir(input_path):
                if os.path.isdir(os.path.join(input_path, f)):
                    continue
                files.append(os.path.join(input_path, f))
        else:
            LOG.warning("Invalid input argument: %s", input_path)
            continue

        for file_path in files:
            if skip_handler and skip_handler.should_skip(file_path):
                continue

            if not report_file.is_supported(file_path):
                continue

            LOG.debug("Parsing '%s'", file_path)
            try:
                reports = report_file.get_reports(
                    file_path, context.checker_labels)
            except Exception as ex:
                LOG.error("Parsing the report file '%s' failed: %s",
                          file_path, ex)
                continue

            reports = reports_helper.filter_reports(
                reports,
                args.review_status if 'review_status' in args else None,
                args.files if 'files' in args else None,
                args.checker_names if 'checker_names' in args else None,
                args.checker_msgs if 'checker_msgs' in args else None,
                args.severities if 'severities' in args else None,
                args.report_hashes if 'report_hashes' in args else None,
                args.detection_statuses if 'detection_statuses' in args else
                None,
                args.open_reports_date if 'open_reports_date' in args else None,
                args.detected_before if 'detected_before' in args else None,
                args.detected_after if 'detected_after' in args else None,
                args.fixed_before if 'fixed_before' in args else None,
                args.fixed_after if 'fixed_after' in args else None,
                review_status_rule)

            # Get report statistics.
            statistics.num_of_analyzer_result_files += 1
            for report in reports:
                statistics.add_report(report)

            source_comment_handler = SourceCodeCommentHandler()
            for report in reports:
                report.comments = []
                if skip_handler and skip_handler.should_skip(report.file.path):
                    continue

                source_file_name = report.file.original_path
                if source_file_name not in file_cache:
                    source_file = os.path.abspath(
                        os.path.join(os.path.dirname(file_path),
                                     source_file_name))
                    source_code_comments = []
                    try:
                        with open(source_file,
                                  encoding='utf-8',
                                  errors='ignore') as sf:
                            source_code_comments = \
                                source_comment_handler.filter_source_line_comments(
                                    sf, report.line)
                    except IOError:
                        LOG.debug("Failed to open source file: %s", source_file)
                    file_cache[source_file_name] = source_code_comments

                review_status = None
                source_code_comments = file_cache[source_file_name]
                if len(source_code_comments) == 1:
                    review_status = source_code_comments[0]['status']
                    report.comments = source_code_comments

                if review_status and review_status not in \
                        source_comment_status_filter:
                    continue

                if suppress_handler_obj:
                    suppress_data = suppress_handler_obj.get_suppressed(report)
                    if suppress_data:
                        report.comments.append(suppress_data)

                    if suppress_data and suppress_data['status'] not in \
                            source_comment_status_filter:
                        continue

                all_reports.append(report)

    if 'statistics' in args:
        statistics.write()

    # Sort reports by file path and position.
    all_reports.sort(key=lambda r: (r.file.path, r.line, r.column))

    if export == 'json':
        data = report_to_json.convert(all_reports, context.checker_labels)
        if 'output_path' in args:
            output_path = os.path.abspath(args.output_path)
            report_to_json.write(data, output_path)
        else:
            report_to_json.write(data, sys.stdout)
    elif export == 'html':
        data = report_to_html.convert(all_reports, context.checker_labels)

        report_to_html.write(data, output_path, trim_path_prefixes)
    elif export == 'gerrit':
        data = gerrit.convert(all_reports, context.checker_labels)
        print(data)
    elif export == 'codeclimate':
        data = codeclimate.convert(all_reports, context.checker_labels)
        print(data)
    elif export == 'baseline':
        data = baseline.convert(all_reports, context.checker_labels)
        if 'output_path' in args:
            output_path = os.path.abspath(args.output_path)
            baseline.write(data, output_path)
        else:
            baseline.write(data, sys.stdout)
    else:
        lines = [
            f"{report.file.path}:{report.line}:{report.column}: "
            f"{report.checker_name}: {report.message} "
            f"[{report.report_hash}]"
            for report in all_reports]

        print(*lines, sep='\n')

    os.chdir(original_cwd)

    # Create index.html for the generated html files.
    if export == 'html':
        html_output_dir = os.path.abspath(args.output_path)
        index_path = os.path.join(html_output_dir, 'index.html')
        with open(index_path, 'w', encoding='utf-8', errors='ignore') as f:
            f.write('''
            <!DOCTYPE HTML>
            <html>
            <head>
                <title>Detailed analysis results</title>
                <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QUeDg0xPRqKjgAAAelJREFUOMulkz1IW1EUx3/3vbxXYpMaSpEMUnFwECpSB5uKVHQQCXUQKVKKdSzULpKl4qRLBUGkia1QbEq7OBW6KFiscRGqLgoFQd9DbYlNY8j79X2ne8WmJIWSOhw4w4Xfn3PPPQdJkiQGDBQEeoG9vbKyEhuUFJEklQQlCUmSIYiIRBRFJFGkUCiI+Xxe5PN5TwI8z8MwDHzfxzRNLMvCtm1c18V1Xc6jKAqqqmIYBpqm9SVJYm9vj/n5eQqFArZtD2T/fwghsCyL09NTVlZWGBsbo1wuD5T5Ho7jsLm5STqdJhqNks1mByqsVCpomkatVkPXdTKZTF+5CILI5XKk02kmJiZIJpOkUimOj4/Js0OQZJ/p6WmWl5fZ2NhgdHSUTCbD4OVCoKoqy8vLBEFALBYjHo9Tq9U4OTmhUChQLBYpuSFRkvD9Dq7b4eDggHK5zPT0NLFYDMdxODo6IpfLUbYEQkj4vk8YhkgShGFIq9UiCAJOTk6oVqtUKhWq1Sr1ep1Go0Gz2aTZbNJut2m326RSKVzX5eXuLm+3tuh0OvhBQKfTwQ9DfN/vUm1s4Pshpmlim3YXbjabvHr9mj9v3/Lm40cqlcqF9sIw5OX2Ng8ePuTHzg6u6/YFaJpGPB5/9uzFC/5sbvLnyxfmHj1iLpHo/pFukSQJTdN+A6oEJu8iiDMnAAAAAElFTkSuQmCC"/>
            </head>
            <body>
            <h1>Detailed analysis results</h1>
            <ul>
            ''')
            for html_file in os.listdir(html_output_dir):
                if html_file.endswith('.html') and html_file != 'index.html':
                    f.write(f'<li><a href="{html_file}">{html_file}</a></li>\n')
            f.write('''
            </ul>
            </body>
            </html>
            ''')

    if 'create_suppress' in args:
        if not suppress_handler_obj:
            LOG.error("Argument error: --suppress-file is required if "
                      "--export-source-suppress is given.")
            sys.exit(2)

        suppress_handler_obj.create_suppress_file()

    LOG.info("Parsed %d analyzer result file%s.",
             statistics.num_of_analyzer_result_files,
             '' if statistics.num_of_analyzer_result_files == 1 else 's')

    LOG.info("Filtered results by review status: %s",
             ', '.join(args.review_status) if 'review_status' in args
             else 'unreviewed, confirmed')

    LOG.info("Found %d report%s.",
             len(all_reports),
             '' if len(all_reports) == 1 else 's')

    if export and 'output_path' in args:
        LOG.info("Exported analysis results to %s.", args.output_path)

    return 0