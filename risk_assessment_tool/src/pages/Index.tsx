import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RiskFactor {
  id: string;
  name: string;
  value: string;
  score: number;
  weight: number;
  options: { value: string; score: number; label: string }[];
  editable?: boolean;
}

interface ClientInfo {
  name: string;
  assessmentDate: string;
  facilityAmount: string;
}

const Index = () => {
  const { toast } = useToast();
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    facilityAmount: ''
  });

  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: 'facility_amount',
      name: 'Facility Amount',
      value: '',
      score: 1,
      weight: 0.08,
      options: [
        { value: 'low', score: 1, label: 'Under $500K' },
        { value: 'medium', score: 2, label: '$500K - $2M' },
        { value: 'high', score: 3, label: 'Over $2M' }
      ]
    },
    {
      id: 'business_relationship',
      name: 'Nature of Business Relationship',
      value: '',
      score: 1,
      weight: 0.03,
      options: [
        { value: 'long_standing', score: 1, label: 'Long-standing (>3 years)' },
        { value: 'established', score: 2, label: 'Established (1-3 years)' },
        { value: 'new', score: 3, label: 'New relationship (<1 year)' }
      ]
    },
    {
      id: 'operating_history',
      name: 'Company Operating History',
      value: '',
      score: 1,
      weight: 0.03,
      options: [
        { value: 'mature', score: 1, label: '>5 years' },
        { value: 'established', score: 2, label: '2-5 years' },
        { value: 'new', score: 3, label: '<2 years' }
      ]
    },
    {
      id: 'legal_entity',
      name: 'Legal Entity Type',
      value: '',
      score: 2,
      weight: 0.05,
      options: [
        { value: 'public_company', score: 1, label: 'Public Company' },
        { value: 'private_company', score: 2, label: 'Private Company' },
        { value: 'partnership', score: 3, label: 'Partnership' },
        { value: 'sole_proprietorship', score: 4, label: 'Sole Proprietorship' }
      ]
    },
    {
      id: 'industry_sector',
      name: 'Industry / Sector Risk',
      value: '',
      score: 1,
      weight: 0.05,
      options: [
        { value: 'low_risk', score: 1, label: 'Low Risk (Manufacturing, Technology)' },
        { value: 'medium_risk', score: 2, label: 'Medium Risk (Construction, Trading)' },
        { value: 'high_risk', score: 3, label: 'High Risk (Cash-intensive, MSB)' }
      ]
    },
    {
      id: 'travel_destination',
      name: 'Travel Destination Risk',
      value: '',
      score: 2,
      weight: 0.08,
      options: [
        { value: 'low_risk', score: 1, label: 'Low risk regions only' },
        { value: 'mixed', score: 2, label: 'Mixed travel including moderate-risk regions' },
        { value: 'high_risk', score: 3, label: 'High-risk or sanctioned regions' }
      ]
    },
    {
      id: 'sanctions',
      name: 'Sanctions & Whitelist Checks',
      value: '',
      score: 1,
      weight: 0.25,
      options: [
        { value: 'no_hits', score: 1, label: 'No Hits' },
        { value: 'minor_hits', score: 2, label: 'Minor/Historical Hits' },
        { value: 'moderate_hits', score: 3, label: 'Moderate Concerns' },
        { value: 'significant_hits', score: 4, label: 'Significant Hits' },
        { value: 'major_hits', score: 5, label: 'Major Sanctions/Blacklist' }
      ]
    },
    {
      id: 'peps',
      name: 'Politically Exposed Persons (PEPs) & Related Parties',
      value: '',
      score: 1,
      weight: 0.25,
      options: [
        { value: 'no_pep', score: 1, label: 'No PEP involvement' },
        { value: 'minor_pep', score: 2, label: 'Minor PEP connection' },
        { value: 'moderate_pep', score: 3, label: 'Moderate PEP involvement' },
        { value: 'significant_pep', score: 4, label: 'Significant PEP involvement' },
        { value: 'major_pep', score: 5, label: 'Major PEP/High-risk political exposure' }
      ]
    },
    {
      id: 'adverse_media',
      name: 'Negative Media & Reputation Check',
      value: '',
      score: 1,
      weight: 0.10,
      options: [
        { value: 'clean', score: 1, label: 'Clean media profile' },
        { value: 'minor_negative', score: 2, label: 'Minor negative coverage' },
        { value: 'moderate_negative', score: 3, label: 'Moderate concerns' },
        { value: 'significant_negative', score: 4, label: 'Significant negative media' },
        { value: 'major_negative', score: 5, label: 'Major scandals/investigations' }
      ]
    },
    {
      id: 'ubo_transparency',
      name: 'UBO Transparency',
      value: '',
      score: 1,
      weight: 0.10,
      options: [
        { value: 'fully_disclosed', score: 1, label: 'UBOs fully disclosed and verified' },
        { value: 'mostly_disclosed', score: 2, label: 'Most UBOs disclosed' },
        { value: 'partially_disclosed', score: 3, label: 'Partial disclosure' },
        { value: 'limited_disclosure', score: 4, label: 'Limited transparency' }
      ]
    },
    {
      id: 'ownership_complexity',
      name: 'Ownership Structure Complexity',
      value: '',
      score: 1,
      weight: 0.05,
      options: [
        { value: 'simple', score: 1, label: 'Simple direct ownership' },
        { value: 'moderate', score: 2, label: 'Moderate complexity' },
        { value: 'complex', score: 3, label: 'Complex multi-layered structure' }
      ]
    }
  ]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFactor, setEditingFactor] = useState<RiskFactor | null>(null);
  const [newFactorDialog, setNewFactorDialog] = useState(false);
  const [editFactorDialog, setEditFactorDialog] = useState(false);
  const [newFactor, setNewFactor] = useState<Partial<RiskFactor>>({
    name: '',
    weight: 0.05,
    options: [{ value: '', score: 1, label: '' }]
  });

  const calculateRiskScore = () => {
    const totalWeightedScore = riskFactors.reduce((sum, factor) => {
      return sum + (factor.score * factor.weight);
    }, 0);

    const riskPercentage = (totalWeightedScore / 5) * 100; // Assuming max score is 5
    
    let riskLevel = 'LOW';
    let dueDiligence = 'SDD'; // Simplified Due Diligence
    
    if (riskPercentage >= 70) {
      riskLevel = 'HIGH';
      dueDiligence = 'EDD'; // Enhanced Due Diligence
    } else if (riskPercentage >= 40) {
      riskLevel = 'MEDIUM';
      dueDiligence = 'CDD'; // Customer Due Diligence
    }

    return {
      totalWeightedScore: totalWeightedScore.toFixed(2),
      riskLevel,
      riskPercentage: riskPercentage.toFixed(1),
      dueDiligence
    };
  };

  const handleFactorChange = (factorId: string, value: string) => {
    setRiskFactors(prev => prev.map(factor => {
      if (factor.id === factorId) {
        const selectedOption = factor.options.find(opt => opt.value === value);
        return {
          ...factor,
          value,
          score: selectedOption?.score || 1
        };
      }
      return factor;
    }));
  };

  const handleWeightChange = (factorId: string, weight: number) => {
    setRiskFactors(prev => prev.map(factor => 
      factor.id === factorId ? { ...factor, weight } : factor
    ));
  };

  const addNewFactor = () => {
    if (!newFactor.name || !newFactor.options?.[0]?.label) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const factor: RiskFactor = {
      id: `custom_${Date.now()}`,
      name: newFactor.name!,
      value: '',
      score: 1,
      weight: newFactor.weight || 0.05,
      options: newFactor.options as { value: string; score: number; label: string }[],
      editable: true
    };

    setRiskFactors(prev => [...prev, factor]);
    setNewFactor({
      name: '',
      weight: 0.05,
      options: [{ value: '', score: 1, label: '' }]
    });
    setNewFactorDialog(false);
    
    toast({
      title: "Success",
      description: "New risk factor added successfully"
    });
  };

  const deleteFactor = (factorId: string) => {
    setRiskFactors(prev => prev.filter(factor => factor.id !== factorId));
    toast({
      title: "Success",
      description: "Risk factor deleted successfully"
    });
  };

  const addOptionToNewFactor = () => {
    setNewFactor(prev => ({
      ...prev,
      options: [...(prev.options || []), { value: '', score: 1, label: '' }]
    }));
  };

  const updateNewFactorOption = (index: number, field: string, value: string | number) => {
    setNewFactor(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const editExistingFactor = () => {
    if (!editingFactor) return;
    
    setRiskFactors(prev => prev.map(factor => 
      factor.id === editingFactor.id ? editingFactor : factor
    ));
    
    setEditingFactor(null);
    setEditFactorDialog(false);
    
    toast({
      title: "Success",
      description: "Risk factor updated successfully"
    });
  };

  const handleScoreChange = (factorId: string, score: number) => {
    setRiskFactors(prev => prev.map(factor => 
      factor.id === factorId ? { ...factor, score } : factor
    ));
  };

  const addOptionToEditingFactor = () => {
    if (!editingFactor) return;
    setEditingFactor({
      ...editingFactor,
      options: [...editingFactor.options, { value: '', score: 1, label: '' }]
    });
  };

  const updateEditingFactorOption = (index: number, field: string, value: string | number) => {
    if (!editingFactor) return;
    setEditingFactor({
      ...editingFactor,
      options: editingFactor.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    });
  };

  const removeEditingFactorOption = (index: number) => {
    if (!editingFactor || editingFactor.options.length <= 1) return;
    setEditingFactor({
      ...editingFactor,
      options: editingFactor.options.filter((_, i) => i !== index)
    });
  };

  const riskScore = calculateRiskScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-900 mb-2">AML Risk Assessment Tool</h1>
          <p className="text-orange-700">Comprehensive risk evaluation and management system</p>
        </div>

        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Client Information
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                    size="sm"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditMode ? 'View Mode' : 'Edit Mode'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="assessmentDate">Assessment Date</Label>
                  <Input
                    id="assessmentDate"
                    type="date"
                    value={clientInfo.assessmentDate}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, assessmentDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="facilityAmount">Facility Amount</Label>
                  <Input
                    id="facilityAmount"
                    value={clientInfo.facilityAmount}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, facilityAmount: e.target.value }))}
                    placeholder="Enter facility amount"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Risk Factor Assessment
                  {isEditMode && (
                    <Dialog open={newFactorDialog} onOpenChange={setNewFactorDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Factor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Risk Factor</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Factor Name</Label>
                            <Input
                              value={newFactor.name || ''}
                              onChange={(e) => setNewFactor(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter factor name"
                            />
                          </div>
                          <div>
                            <Label>Weight (0-1)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1"
                              value={newFactor.weight || 0.05}
                              onChange={(e) => setNewFactor(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label>Options</Label>
                            {newFactor.options?.map((option, index) => (
                              <div key={index} className="grid grid-cols-3 gap-2 mt-2">
                                <Input
                                  placeholder="Option label"
                                  value={option.label}
                                  onChange={(e) => updateNewFactorOption(index, 'label', e.target.value)}
                                />
                                <Input
                                  placeholder="Value"
                                  value={option.value}
                                  onChange={(e) => updateNewFactorOption(index, 'value', e.target.value)}
                                />
                                <Input
                                  type="number"
                                  placeholder="Score"
                                  min="1"
                                  max="5"
                                  value={option.score}
                                  onChange={(e) => updateNewFactorOption(index, 'score', parseInt(e.target.value))}
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addOptionToNewFactor}
                              className="mt-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setNewFactorDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={addNewFactor} className="bg-orange-500 hover:bg-orange-600 text-white">
                              <Save className="w-4 h-4 mr-2" />
                              Add Factor
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-orange-50">
                        <th className="border border-orange-200 p-3 text-left text-orange-900">Risk Factor</th>
                        <th className="border border-orange-200 p-3 text-left text-orange-900">Input Value</th>
                        <th className="border border-orange-200 p-3 text-center text-orange-900">Risk Score</th>
                        <th className="border border-orange-200 p-3 text-center text-orange-900">Weight</th>
                        <th className="border border-orange-200 p-3 text-center text-orange-900">Weighted Score</th>
                        {isEditMode && <th className="border border-orange-200 p-3 text-center text-orange-900">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {riskFactors.map((factor) => (
                        <tr key={factor.id} className="hover:bg-orange-50">
                          <td className="border border-orange-200 p-3 font-medium">
                            {isEditMode ? (
                              <Input
                                value={factor.name}
                                onChange={(e) => {
                                  setRiskFactors(prev => prev.map(f => 
                                    f.id === factor.id ? { ...f, name: e.target.value } : f
                                  ));
                                }}
                                className="font-medium"
                              />
                            ) : (
                              factor.name
                            )}
                          </td>
                          <td className="border border-orange-200 p-3">
                            <Select
                              value={factor.value}
                              onValueChange={(value) => handleFactorChange(factor.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                {factor.options.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="border border-orange-200 p-3 text-center">
                            {isEditMode ? (
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                value={factor.score}
                                onChange={(e) => handleScoreChange(factor.id, parseInt(e.target.value))}
                                className="w-16 text-center"
                              />
                            ) : (
                              <Badge 
                                className={
                                  factor.score <= 2 
                                    ? "bg-green-100 text-green-800 border-green-300" 
                                    : factor.score <= 3 
                                    ? "bg-orange-100 text-orange-800 border-orange-300" 
                                    : "bg-red-100 text-red-800 border-red-300"
                                }
                              >
                                {factor.score}
                              </Badge>
                            )}
                          </td>
                          <td className="border border-orange-200 p-3 text-center">
                            {isEditMode ? (
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={factor.weight}
                                onChange={(e) => handleWeightChange(factor.id, parseFloat(e.target.value))}
                                className="w-20 text-center"
                              />
                            ) : (
                              factor.weight.toFixed(2)
                            )}
                          </td>
                          <td className="border border-orange-200 p-3 text-center">
                            {(factor.score * factor.weight).toFixed(2)}
                          </td>
                          {isEditMode && (
                            <td className="border border-orange-200 p-3 text-center">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingFactor(factor);
                                    setEditFactorDialog(true);
                                  }}
                                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                {factor.editable && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteFactor(factor.id)}
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Risk Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900">Total Weighted Score</h3>
                    <p className="text-3xl font-bold text-orange-600">{riskScore.totalWeightedScore}</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h3 className="text-lg font-semibold text-amber-900">Risk Level</h3>
                    <Badge 
                      className={
                        riskScore.riskLevel === 'LOW' 
                          ? 'bg-green-100 text-green-800 border-green-300 text-2xl font-bold px-4 py-2' 
                          : riskScore.riskLevel === 'MEDIUM' 
                          ? 'bg-orange-100 text-orange-800 border-orange-300 text-2xl font-bold px-4 py-2' 
                          : 'bg-red-100 text-red-800 border-red-300 text-2xl font-bold px-4 py-2'
                      }
                    >
                      {riskScore.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-900">Risk Percentage</h3>
                    <p className="text-3xl font-bold text-yellow-600">{riskScore.riskPercentage}%</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold text-red-900">Due Diligence</h3>
                    <Badge 
                      className={
                        riskScore.dueDiligence === 'SDD' 
                          ? 'bg-green-100 text-green-800 border-green-300 text-2xl font-bold px-4 py-2' 
                          : riskScore.dueDiligence === 'CDD' 
                          ? 'bg-orange-100 text-orange-800 border-orange-300 text-2xl font-bold px-4 py-2' 
                          : 'bg-red-100 text-red-800 border-red-300 text-2xl font-bold px-4 py-2'
                      }
                    >
                      {riskScore.dueDiligence}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Factor Dialog */}
        <Dialog open={editFactorDialog} onOpenChange={setEditFactorDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-orange-900">Edit Risk Factor</DialogTitle>
            </DialogHeader>
            {editingFactor && (
              <div className="space-y-4">
                <div>
                  <Label>Factor Name</Label>
                  <Input
                    value={editingFactor.name}
                    onChange={(e) => setEditingFactor({ ...editingFactor, name: e.target.value })}
                    placeholder="Enter factor name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Weight (0-1)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={editingFactor.weight}
                      onChange={(e) => setEditingFactor({ ...editingFactor, weight: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Current Score</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={editingFactor.score}
                      onChange={(e) => setEditingFactor({ ...editingFactor, score: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Options</Label>
                  {editingFactor.options.map((option, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mt-2">
                      <Input
                        placeholder="Option label"
                        value={option.label}
                        onChange={(e) => updateEditingFactorOption(index, 'label', e.target.value)}
                      />
                      <Input
                        placeholder="Value"
                        value={option.value}
                        onChange={(e) => updateEditingFactorOption(index, 'value', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Score"
                        min="1"
                        max="5"
                        value={option.score}
                        onChange={(e) => updateEditingFactorOption(index, 'score', parseInt(e.target.value))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEditingFactorOption(index)}
                        disabled={editingFactor.options.length <= 1}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOptionToEditingFactor}
                    className="mt-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditFactorDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editExistingFactor} className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;